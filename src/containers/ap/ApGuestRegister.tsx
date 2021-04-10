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

const validate: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;
	//const emailValid = (os : Option<string>) => os.isSome() && os.getOrElse("")
	const validations = [
		new Validation(isNotNull(state.formData.firstName), "Please enter your first name."),
		new Validation(isNotNull(state.formData.lastName), "Please enter your last name."),
		new Validation(isNotNull(state.formData.dobMonth), "Please enter your birth month."),
		new Validation(isNotNull(state.formData.dobDay), "Please enter your birth day."),
		new Validation(isNotNull(state.formData.dobYear), "Please enter your birth year."),
		new Validation(isNotNull(state.formData.guestPhoneFirst), "Please enter a valid phone number."),
		new Validation(isNotNull(state.formData.guestPhoneSecond), "Please enter a valid phone number."),
		new Validation(isNotNull(state.formData.guestPhoneThird), "Please enter a valid phone number."),
		new Validation(isNotNull(state.formData.guestPhoneType), "Please select a phone type."),
		new Validation(isNotNull(state.formData.email), "Please enter your email."),
		new Validation(isNotNull(state.formData.ecFirstName), "Please enter an emergency contact first name."),
		new Validation(isNotNull(state.formData.ecLastName), "Please enter an emergency contact last name."),
		new Validation(isNotNull(state.formData.ecRelationship), "Please enter your relationship to your emergency contact."),
		new Validation(isNotNull(state.formData.ecPhoneFirst), "Please enter a valid emergency contact phone number."),
		new Validation(isNotNull(state.formData.ecPhoneSecond), "Please enter a valid emergency contact phone number."),
		new Validation(isNotNull(state.formData.ecPhoneThird), "Please enter a valid emergency contact phone number."),
		new Validation(isNotNull(state.formData.ecPhoneType), "Please select an emergency contact phone type.")
		];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

function makePhone (ext : Option<string>, first : Option<string>, second : Option<string>, third : Option<string>) : string {
	return ext.getOrElse("").concat(first.getOrElse("")).concat(second.getOrElse("")).concat(third.getOrElse(""));
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
		switch(this.state.pageState){
			case PageState.GUEST_INFORMATION:
			const validationResults = validate(this.state);
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
				const dob : Date = new Date(Number.parseInt(this.state.formData.dobYear.getOrElse("")), Number.parseInt(this.state.formData.dobMonth.getOrElse("")), Number.parseInt(this.state.formData.dobDay.getOrElse("")));
				let formattedDate = (moment(dob)).format('MM/DD/YYYY');
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
		const years = range(thisYear-120, thisYear-15)
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const progressButton = (<FactaButton key={"key..."} text="next >" onClick={this.progressFunction} spinnerOnClick forceSpinner={false}/>);
		
		const self=this;

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const formContent = (
		<div id="guestinfo">
			Guests must self register. Members please direct your guests to this page to register themselves. Under 18 guests must be registered by their parent or guardian.
			<br />
			At the end of registration you will be able to print or save your ticket, you'll also receive an email ticket.
			<br />
			<table id="info" width="100%"><tbody>
				<th>Guest Information</th>
				<tr>
				<td>
				<FormInput
					id="firstName"
					label="First Name"
					isPassword={false}
					isRequired
					value={self.state.formData.firstName}
					updateAction={updateState}
				/>
				</td>
				<td>
				<FormInput
					id="lastName"
					label="Last Name"
					isPassword={false}
					isRequired
					value={self.state.formData.lastName}
					updateAction={updateState}
				/>
				</td>
				</tr>
				<tr>
				<td>
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
				</td>
				<td>
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
				</td>
				</tr>
				<tr>
				<td>
				<FormInput
				id="email"
				label="Email"
				isPassword={false}
				isRequired
				value={self.state.formData.email}
				updateAction={updateState}
				/>
				</td>
				<td>
				<p>opt out</p>
				</td>
				</tr>
				<th>Emergency Contact Information</th>
				<tr>This should be someone close to you who is not going on the water with you.</tr>
				<tr>For under 18 guests this should be a parent or guardian.</tr>
				<tr>
				<td>
				<FormInput
				id="ecFirstName"
				label="First Name"
				isPassword={false}
				isRequired
				value={self.state.formData.ecFirstName}
				updateAction={updateState}
				/>
				</td>
				<td>
				<FormInput
				id="ecLastName"
				label="Last Name"
				isPassword={false}
				isRequired
				value={self.state.formData.ecLastName}
				updateAction={updateState}
				/>
				</td>
				</tr>
				<tr>
				<td>
				<FormInput
				id="ecRelationship"
				label="Relationship"
				isPassword={false}
				isRequired
				value={self.state.formData.ecRelationship}
				updateAction={updateState}
				/>
				</td>
				<td>
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
				</td>
				</tr>
				<tr>
				<td>
				</td>	
				<td>
				{ progressButton }
				</td>
				</tr>
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
					<iframe title="Waiver of Liability" src="/waivers/live/ApGuestWaiver.html" width="100%" height="400px"></iframe>
				</tr>
				<tr>
					<td>{ agreeCheckbox } { progressButton }</td>
				</tr>
			</tbody></table>
		</div>);
		const under18WaiverContent = (
		<div id="under18waiver">
			<table width="100%"><tbody>
				<tr>
					<iframe title="Waiver of Liability" src="/waivers/live/Under18GuestWaiver.html" width="100%" height="400px"></iframe>
				</tr>
				<tr>
					<td>{ agreeCheckbox } { progressButton }</td>
				</tr>
			</tbody></table>
		</div>);

		var articleContent = formContent;

		switch(this.state.pageState){
			case PageState.GUEST_INFORMATION:
				articleContent = formContent;
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
