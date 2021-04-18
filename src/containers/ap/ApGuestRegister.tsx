import * as React from "react";
import { setAPImage } from "../../util/set-bg-image";
import FactaArticleRegion from '@facta/FactaArticleRegion';
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import { History } from 'history'
import DateTriPicker, {  DateTriPickerProps } from "@components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps } from "@components/PhoneTriBox";
import { SingleCheckbox } from "@components/InputGroup";
import formUpdateState from '../../util/form-update-state';
import TextInput from '../../components/TextInput';
import Validation from '../../util/Validation';
import FactaButton from '../../theme/facta/FactaButton';
import { Option, none, some } from 'fp-ts/lib/Option';
import { postWrapper as createPerson } from "@async/ap/create-person"
import { postWrapper as createCard } from  "@async/ap/create-card"
//import { jpBasePath } from "../../app/paths/jp/_base";
//import { Link } from "react-router-dom";
//import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";
import { makePostJSON } from "@core/APIWrapperUtil";
import {FactaErrorDiv} from "@facta/FactaErrorDiv";
import FactaMainPage from "../../theme/facta/FactaMainPage";
import * as moment from 'moment';
import range from "@util/range";
//import { make } from "fp-ts/lib/Tree";

type Props = {
	history: History<any>
}

type NewGuestInformation = {
	personID: number,
	cardNumber: number,
	cardImageData: string
}

type State = {
	formData: Form,
	validationErrors: string[],
	pageState: PageState,
	waiverAccepted: boolean,
	createResults: Option<NewGuestInformation>
}

enum PageState{
	GUEST_INFORMATION,
	EC_INFORMATION,
	WAIVER,
	FINISH
}

const defaultForm = {
	firstName: none as Option<string>,
	lastName: none as Option<string>,
	email: none as Option<string>,
	dobMonth: none as Option<string>,
	dobDay: none as Option<string>,
	dobYear: none as Option<string>,
	guestPhoneFirst: none as Option<string>,
	guestPhoneSecond: none as Option<string>,
	guestPhoneThird: none as Option<string>,
	guestPhoneExt: none as Option<string>,
	guestPhoneType: none as Option<string>,
	ecFirstName: none as Option<string>,
	ecLastName: none as Option<string>,
	ecPhoneFirst: none as Option<string>,
	ecPhoneSecond: none as Option<string>,
	ecPhoneThird: none as Option<string>,
	ecPhoneExt: none as Option<string>,
	ecPhoneType: none as Option<string>,
	ecRelationship: none as Option<string>

}

type Form = typeof defaultForm

class FormInput extends TextInput<Form> {}

/* 
 * DOB is a valid date (e.g. 2/31/1990 should throw an error)
 * Email is a valid email (I use the regex /^[A-Z0-9._%-]+@[A-Z0-9._%-]+\.[A-Z]{2,4}$/i )
 * Phone number is valid (matches /^[0-9]{10}.*$/ ie exactly 10 digits, with the .* for any extension )
*/

const phoneRegExp = new RegExp(/^[0-9]{10}.*$/);
const isPhoneValid = (p1 : Option<string>, p2 : Option<string>, p3 : Option<string>, pe : Option<string>) => phoneRegExp.test(makePhone(pe, p1, p2, p3));
const validateECInfo: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;
	const validations = [
		new Validation(isNotNull(state.formData.ecFirstName), "Please enter an emergency contact first name."),
		new Validation(isNotNull(state.formData.ecLastName), "Please enter an emergency contact last name."),
		new Validation(isNotNull(state.formData.ecRelationship), "Please enter your relationship to your emergency contact."),
		new Validation(isPhoneValid(state.formData.ecPhoneFirst, state.formData.ecPhoneSecond, state.formData.ecPhoneThird, state.formData.ecPhoneExt), "Please enter a valid emergency contact phone number.")
		];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

const validateGuestInfo: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;
	const emailRegexp = new RegExp(/^[A-Z0-9._%-]+@[A-Z0-9._%-]+\.[A-Z]{2,4}$/i);
	const isEmailValid = (os : Option<string>) => os.isSome() && emailRegexp.test(os.getOrElse(""))
	const isDOBValid = (state : State) => getMoment(state).isValid();
	const validations = [
		new Validation(isNotNull(state.formData.firstName), "Please enter your first name."),
		new Validation(isNotNull(state.formData.lastName), "Please enter your last name."),
		new Validation(isDOBValid(state), "Please a valid birthday"),
		new Validation(isPhoneValid(state.formData.guestPhoneFirst, state.formData.guestPhoneSecond, state.formData.guestPhoneThird, state.formData.guestPhoneExt), "Please enter a valid guest phone number."),
		new Validation(isEmailValid(state.formData.email), "Please enter a valid email.")
		];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

function makePhone (ext : Option<string>, first : Option<string>, second : Option<string>, third : Option<string>) : string {
	return first.getOrElse("").concat(second.getOrElse("")).concat(third.getOrElse("")).concat(ext.getOrElse(""));
}

function getMoment (state : State) : any {
	return moment({year: Number.parseInt(state.formData.dobYear.getOrElse("-1")), month: (Number.parseInt(state.formData.dobMonth.getOrElse("-1"))-1), date: Number.parseInt(state.formData.dobDay.getOrElse("-1"))});
}

export default class ApPreRegister extends React.PureComponent<Props, State> {
	
	//private printableDivRef: React.RefObject<HTMLDivElement>

	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: [],
			pageState: PageState.GUEST_INFORMATION,
			waiverAccepted: false,
			createResults: none
		}
	}

	handlePrint = () => {
		//TODO maybe redo this in react style, if jon wants.
		console.log("printing");
		var a = window.open('', '', 'height=500px, width=600px');
            a.document.write('<html>');
			a.document.write('<head>');
			a.document.write('<title>');
			a.document.write(this.state.formData.firstName.getOrElse("FIRST").concat(' ').concat(this.state.formData.lastName.getOrElse("LAST")));
			a.document.write(' Guest Ticket</title>');
			a.document.write('<body>');
			a.document.write('<div id="printbox" style="padding: 40px; width: 220px; border: 2px solid black;">');
			a.document.write('<img src="/images/guest-ticket.png" alt="Community Boating Guest Ticket" width="150px" style="padding-left: 30px"></img>');
			a.document.write('<img src="data:image/png;base64,'.concat(this.state.createResults.getOrElse({ personID: 0, cardNumber: 0, cardImageData: "" }).cardImageData).concat('" alt="Barcode Error, Please See Front Office"  width="150PX" style="padding-top: 10px; padding-left:30px"></img>'));
			a.document.write('<h3 style="text-align: center">');
			a.document.write(this.state.formData.firstName.getOrElse("FIRST").concat(' ').concat(this.state.formData.lastName.getOrElse("LAST")));
			a.document.write('</h3>');
			a.document.write('<p>Please bring this card with you to the dockhouse when you come sailing.</p>');
			a.document.write('</div>');
            a.document.write('</body></html>');
			//a.document.body.append(this.printableDivRef.current);
            a.document.close();
			a.onload = () => {
				a.print();
			};
	}

	progressFunction = () => {
		var validationResults;
		switch(this.state.pageState){
			case PageState.GUEST_INFORMATION:
			validationResults = validateGuestInfo(this.state);
			if (validationResults.length > 0) {
				this.setState({
					...this.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				this.setState({
					...this.state,
					validationErrors: [],
					pageState: PageState.EC_INFORMATION
				});
				return Promise.resolve();
			}
			break;
			case PageState.EC_INFORMATION:
			validationResults = validateECInfo(this.state);
			if (validationResults.length > 0) {
				this.setState({
					...this.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				this.setState({
					...this.state,
					validationErrors: [],
					pageState: PageState.WAIVER
				});
				return Promise.resolve();
			}
			break;
			case PageState.WAIVER:
				let formattedDate = (getMoment(this.state)).format('MM/DD/YYYY');
				let guestPhone = makePhone(this.state.formData.guestPhoneExt, this.state.formData.guestPhoneFirst, this.state.formData.guestPhoneSecond, this.state.formData.guestPhoneThird);
				let emergPhone = makePhone(this.state.formData.ecPhoneExt, this.state.formData.ecPhoneFirst, this.state.formData.ecPhoneSecond, this.state.formData.ecPhoneThird);
				/*createPerson.send(PostURLEncoded({
					firstName: this.state.formData.firstName.getOrElse(""),
					lastName: this.state.formData.lastName.getOrElse(""),
					emailAddress: this.state.formData.email.getOrElse(""),
					dob: formattedDate,
					phonePrimary: guestPhone,
					emerg1Name: this.state.formData.ecFirstName.getOrElse("").concat(this.state.formData.ecLastName.getOrElse("")),
					emerg1Relation: this.state.formData.ecRelationship.getOrElse(""),
					emerg1PhonePrimary: emergPhone,
					previousMember: false
				}))*/
				if(this.state.waiverAccepted){
					const self = this;
					this.setState({
						...this.state,
						validationErrors: []
					})
					return createPerson.send(makePostJSON({
						firstName: this.state.formData.firstName.getOrElse(""),
						lastName: this.state.formData.lastName.getOrElse(""),
						emailAddress: this.state.formData.email.getOrElse(""),
						dob: formattedDate,
						phonePrimary: guestPhone,
						emerg1Name: this.state.formData.ecFirstName.getOrElse("").concat(this.state.formData.ecLastName.getOrElse("")),
						emerg1Relation: this.state.formData.ecRelationship.getOrElse(""),
						emerg1PhonePrimary: emergPhone,
						previousMember: false
					})).then(res => {
						if(res.type === "Success"){
							return createCard.send(makePostJSON({
								personID: res.success.personID
							})).then(res2 =>{
								if(res2.type === "Success"){
									console.log("created a new person and card, " + res2.success.cardNumber);
										self.setState({
										...self.state,
										pageState: PageState.FINISH,
										createResults: some({
											personID: res.success.personID,
											cardNumber: res2.success.cardNumber,
											cardImageData: res2.success.barcode
										}),
										validationErrors: []
									})
									return Promise.resolve("Success");
								}else{
									console.log("error with card creation call");
									self.setState({
										...self.state,
										validationErrors: ["An internal error has occured, please try again later"]
									})
									return Promise.resolve("Failure");
								}
							});
						}else{
							console.log("error with person creation call");
							self.setState({
								...self.state,
								validationErrors: ["An internal error has occured, please try again later"]
							})
							return Promise.resolve("Failure");
						}
					});
				}else{
					this.setState({
						...this.state,
						validationErrors: ["Please agree to the terms to continue"]
					});
				}
			break;
		}
		return Promise.resolve("Success");
	}
	
	render() {
		const thisYear = Number(moment().format("YYYY"))
		const years = range(thisYear-120, thisYear)
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const progressButton = (<FactaButton key={"key..."} text="next >" onClick={this.progressFunction} spinnerOnClick forceSpinner={false}/>);
		
		const self=this;

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const guestContent = (
		<div id="guestinfo">
			Guests must self register. Members please direct your guests to this page to register themselves. Under 18 guests must be registered by their parent or guardian.
			<br />
			At the end of registration you will be able to print or save your ticket, you'll also receive an email ticket.
			<br />
				<table id="info" style={{ width: "100%"}}><tbody>
					<tr><th style={{ width: "250px" }}>Guest Information</th><th style={{ width: "350px" }} /></tr>
				<FormInput
					id="firstName"
					label="First Name"
					isPassword={false}
					isRequired
					value={self.state.formData.firstName}
					updateAction={updateState}
				/>
				<FormInput
					id="lastName"
					label="Last Name"
					isPassword={false}
					isRequired
					value={self.state.formData.lastName}
					updateAction={updateState}
				/>
				<DateTriPicker<Form, DateTriPickerProps<Form>>
				years={years}
				monthID="dobMonth"
				dayID="dobDay"
				yearID="dobYear"
				isRequired={true}
				monthValue={self.state.formData.dobMonth}
				dayValue={self.state.formData.dobDay}
				yearValue={self.state.formData.dobYear}
				updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
				label="Phone"
				firstID="guestPhoneFirst"
				secondID="guestPhoneSecond"
				thirdID="guestPhoneThird"
				extID="guestPhoneExt"
				typeID="guestPhoneType"
				firstValue={self.state.formData.guestPhoneFirst}
				secondValue={self.state.formData.guestPhoneSecond}
				thirdValue={self.state.formData.guestPhoneThird}
				extValue={self.state.formData.guestPhoneExt}
				typeValue={self.state.formData.guestPhoneType}
				updateAction={updateState}
				isRequired={true}
				/>
				<FormInput
				id="email"
				label="Email"
				isPassword={false}
				isRequired
				value={self.state.formData.email}
				updateAction={updateState}
					/><tr><td /><td /><td>
						{progressButton}
					</td></tr>
				</tbody></table>
				</div>);
		const ecContent = (
				<div id="ecinfo">
				<table id="ecInfo" style={{ width: "100%"}}><tbody>
					<tr><th style={{ width: "250px" }}>Emergency Contact Information</th><th style={{ width: "350px" }} /></tr>
					<tr><td /><td>This should be someone close to you who is not going on the water with you.</td></tr>
					<tr><td /><td>For under 18 guests this should be a parent or guardian.</td></tr>
				<FormInput
				id="ecFirstName"
				label="First Name"
				isPassword={false}
				isRequired
				value={self.state.formData.ecFirstName}
				updateAction={updateState}
				/>
				<FormInput
				id="ecLastName"
				label="Last Name"
				isPassword={false}
				isRequired
				value={self.state.formData.ecLastName}
				updateAction={updateState}
				/>
				<FormInput
				id="ecRelationship"
				label="Relationship"
				isPassword={false}
				isRequired
				value={self.state.formData.ecRelationship}
				updateAction={updateState}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
				label="Emergency Contact Phone"
				firstID="ecPhoneFirst"
				secondID="ecPhoneSecond"
				thirdID="ecPhoneThird"
				extID="ecPhoneExt"
				typeID="ecPhoneType"
				firstValue={self.state.formData.ecPhoneFirst}
				secondValue={self.state.formData.ecPhoneSecond}
				thirdValue={self.state.formData.ecPhoneThird}
				extValue={self.state.formData.ecPhoneExt}
				typeValue={self.state.formData.ecPhoneType}
				updateAction={updateState}
				isRequired={true}
				/>
				<tr><td /><td /><td>
				{ progressButton }
				</td></tr>
				</tbody></table>
		</div>);
		const finishScreenContent = (
			<div>
				<h1>Success!</h1>
				<h3>You are now registered as a guest!</h3> 
				<p>You may print or save your card below, you will also receive a confirmation email with your card attatched. </p>
				<p>Please bring your card along in print or on a mobile device when you visit the boathouse.</p>
				<p>You will have the option to print your card at the boathouse if you don't have a printer or mobile device available.</p>
				<a onClick={self.handlePrint}>Guest Card</a>
				</div>);
		console.log(self.state.createResults.getOrElse({personID: 0, cardNumber: 0, cardImageData: ""}).cardImageData);
		const agreeCheckbox = (<FactaNotitleRegion>
			<SingleCheckbox
				id="accept"
				label="I Agree To These Terms"

				updateAction={(id: string, waiverValue: any) => {
					self.setState({
						...this.state,
						waiverAccepted: (waiverValue === true)
					})
					console.log(waiverValue);
				}}
				value={self.state ? some(self.state.waiverAccepted) : none}
				justElement={true}
			/>
		</FactaNotitleRegion>);
		const adultWaiverContent = (<div id="adultwaiver">
		<table width="100%"><tbody>
				<tr>
					<td>
						<iframe title="Waiver of Liability" src="/waivers/live/ApGuestWaiver.html" width="100%" height="400px"></iframe>
					</td>
				</tr>
				<tr>
					<td>
						{agreeCheckbox}
						{progressButton}
					</td>
				</tr>
			</tbody></table>
		</div>);
		const under18WaiverContent = (
		<div id="under18waiver">
			<table width="100%"><tbody>
					<tr>
						<td>
							<iframe title="Waiver of Liability" src="/waivers/live/Under18GuestWaiver.html" width="100%" height="400px"></iframe>
						</td>
					</tr>
				<tr>
					<td>{ agreeCheckbox } { progressButton }</td>
				</tr>
			</tbody></table>
		</div>);

		var articleContent = guestContent;

		switch(this.state.pageState){
			case PageState.GUEST_INFORMATION:
				articleContent = guestContent;
				break;
			case PageState.EC_INFORMATION:
				articleContent = ecContent;
				break;
			case PageState.WAIVER:
				articleContent = adultWaiverContent;
				const now = new Date();
				const DOB = new Date(parseInt(this.state.formData.dobYear.getOrElse("")), parseInt(this.state.formData.dobMonth.getOrElse("")), parseInt(this.state.formData.dobDay.getOrElse("")))
				if(Number(DOB) >= (Number(now) - 18 * 365 * 24 * 60 * 60 * 1000))
					articleContent = under18WaiverContent;
				break;
			case PageState.FINISH:
				articleContent = finishScreenContent;
				break;
		}


		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title="Guest Registration">
				{ articleContent }
				
			</FactaArticleRegion>
		</FactaMainPage>
	}
}