import * as React from "react";
import { setAPImage } from "@util/set-bg-image";
import FactaArticleRegion from '@facta/FactaArticleRegion';
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import { History } from 'history'
import DateTriPicker, {  DateTriPickerProps } from "@components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps } from "@components/PhoneTriBox";
import { SingleCheckbox } from "@components/InputGroup";
import formUpdateState from '@util/form-update-state';
import TextInput from '@components/TextInput';
import Validation from '@util/Validation';
import FactaButton from '@facta/FactaButton';
import { Option, none, some } from 'fp-ts/lib/Option';
import { postWrapper as createGuest } from "@async/ap/create-ap-guest"
import { makePostJSON, PostURLEncoded } from "@core/APIWrapperUtil";
import {FactaErrorDiv} from "@facta/FactaErrorDiv";
import FactaMainPage from "@facta/FactaMainPage";
import * as moment from 'moment';
import range from "@util/range";
import {postWrapper as refreshProto} from "@async/check-proto-person-cookie"

export enum NONMEM_REG_FLOW {
	GUEST,
	RENTAL
}

type Props = {
	history: History<any>,
	rentalMode: NONMEM_REG_FLOW,
}

type NewGuestInformation = {
	ticketHTML: string
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

const phoneRegExp = new RegExp(/^[0-9]{10}([0-9])*$/);
const isPhoneValid = (p1 : Option<string>, p2 : Option<string>, p3 : Option<string>, pe : Option<string>) => phoneRegExp.test(makePhone(pe, p1, p2, p3));
const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;
const validateECInfo: (state: State) => string[] = state => {
	const validations = [
		new Validation(isNotNull(state.formData.ecFirstName), "Please enter an emergency contact first name."),
		new Validation(isNotNull(state.formData.ecLastName), "Please enter an emergency contact last name."),
		new Validation(isNotNull(state.formData.ecRelationship), "Please enter your relationship to your emergency contact."),
		new Validation(isPhoneValid(state.formData.ecPhoneFirst, state.formData.ecPhoneSecond, state.formData.ecPhoneThird, state.formData.ecPhoneExt), "Please enter a valid emergency contact phone number."),
		new Validation(isNotNull(state.formData.ecPhoneType), "Please specify phone number type."),
	];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

const validateGuestInfo: (state: State) => string[] = state => {
	const emailRegexp = new RegExp(/^[A-Z0-9._%-]+@[A-Z0-9._%-]+\.[A-Z]{2,4}$/i);
	const isEmailValid = (os : Option<string>) => os.isSome() && emailRegexp.test(os.getOrElse(""))
	const isDOBValid = (state : State) => getDOBMoment(state).isValid();
	const validations = [
		new Validation(isNotNull(state.formData.firstName), "Please enter your first name."),
		new Validation(isNotNull(state.formData.lastName), "Please enter your last name."),
		new Validation(isDOBValid(state), "Please enter a valid birthday."),
		new Validation(isPhoneValid(state.formData.guestPhoneFirst, state.formData.guestPhoneSecond, state.formData.guestPhoneThird, state.formData.guestPhoneExt), "Please enter a valid guest phone number."),
		new Validation(isNotNull(state.formData.guestPhoneType), "Please specify phone number type."),
		new Validation(isEmailValid(state.formData.email), "Please enter a valid email.")
	];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

function makePhone (ext : Option<string>, first : Option<string>, second : Option<string>, third : Option<string>) : string {
	return first.getOrElse("").concat(second.getOrElse("")).concat(third.getOrElse("")).concat(ext.getOrElse(""));
}

function getDOBMoment (state : State) : any {
	return moment({year: Number.parseInt(state.formData.dobYear.getOrElse("-1")), month: (Number.parseInt(state.formData.dobMonth.getOrElse("-1"))-1), date: Number.parseInt(state.formData.dobDay.getOrElse("-1"))});
}

export default class ApPreRegister extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: [],
			pageState: PageState.GUEST_INFORMATION,
			waiverAccepted: false,
			createResults: none
		};
		refreshProto.send(PostURLEncoded({}));
	}

	handlePrint = () => {
		//TODO maybe redo this in react style, if jon wants.
		var a = window.open('', '', 'height=500px, width=600px');
		this.writeToDocument(a.document);
		a.onload = () => {
			a.print();
		};
	}

	writeToDocument(document: Document) {
		document.write('<html>');
		document.write('<head>');
		document.write('<title>');
		document.write(this.state.formData.firstName.getOrElse("FIRST").concat(' ').concat(this.state.formData.lastName.getOrElse("LAST")));
		document.write(' Guest Ticket</title>');
		document.write('<body>');
		document.write(this.state.createResults.map(r => r.ticketHTML.replace("$API_URL$", "")).getOrElse(""));
		document.write('</body></html>');
		document.close();
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
				refreshProto.send(PostURLEncoded({}));
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
				refreshProto.send(PostURLEncoded({}));
				return Promise.resolve();
			}
			break;
			case PageState.WAIVER:
				let formattedDate = (getDOBMoment(this.state)).format('MM/DD/YYYY');
				let guestPhone = makePhone(this.state.formData.guestPhoneExt, this.state.formData.guestPhoneFirst, this.state.formData.guestPhoneSecond, this.state.formData.guestPhoneThird);
				let emergPhone = makePhone(this.state.formData.ecPhoneExt, this.state.formData.ecPhoneFirst, this.state.formData.ecPhoneSecond, this.state.formData.ecPhoneThird);
				if(this.state.waiverAccepted){
					const self = this;
					this.setState({
						...this.state,
						validationErrors: []
					})
					return createGuest.send(makePostJSON({
						firstName: this.state.formData.firstName.getOrElse(""),
						lastName: this.state.formData.lastName.getOrElse(""),
						emailAddress: this.state.formData.email.getOrElse(""),
						dob: formattedDate,
						phonePrimary: guestPhone,
						emerg1Name: this.state.formData.ecFirstName.getOrElse("") + " " + this.state.formData.ecLastName.getOrElse(""),
						emerg1Relation: this.state.formData.ecRelationship.getOrElse(""),
						emerg1PhonePrimary: emergPhone,
						previousMember: false,
						phonePrimaryType: this.state.formData.guestPhoneType.getOrElse(""),
						emerg1PhonePrimaryType: this.state.formData.ecPhoneType.getOrElse(""),
					})).then(res => {
						if(res.type === "Success"){
							self.setState({
								...self.state,
								pageState: PageState.FINISH,
								createResults: some({
									ticketHTML: res.success.ticketHTML
								}),
								validationErrors: []
							});
							refreshProto.send(PostURLEncoded({}));
							return Promise.resolve("Success");
						}else{
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

	noun = (
		this.props.rentalMode == NONMEM_REG_FLOW.RENTAL
		? "Renter"
		: "Guest"
	)
	
	render() {
		const thisYear = Number(moment().format("YYYY"))
		const years = range(thisYear-120, thisYear)
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const progressButton = (<FactaButton key={"key..."} text="next >" onClick={this.progressFunction} spinnerOnClick />);
		
		const self=this;

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const guestContent = (
		<div id="guestinfo">
			{this.noun}s must self register. Members/Renters please direct your guests to this page to register themselves.
			Under 18 {this.noun}s must be registered by their parent or guardian.
			<br />
			At the end of registration you will be able to print or save your ticket, you'll also receive an email ticket.
			<br />
				<table id="info" style={{ width: "100%"}}><tbody>
					<tr><th style={{ width: "250px" }}>{`${this.noun} Information`}</th><th style={{ width: "350px" }} /></tr>
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
						isRequired
						value={self.state.formData.lastName}
						updateAction={updateState}
					/>
					<DateTriPicker<Form, DateTriPickerProps<Form>>
						years={years}
						monthID="dobMonth"
						dayID="dobDay"
						yearID="dobYear"
						isRequired
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
						isRequired
					/>
					<FormInput
						id="email"
						label="Email"
						isPassword={false}
						isRequired
						value={self.state.formData.email}
						updateAction={updateState}
					/>
					<tr><td /><td /><td>
						{progressButton}
					</td></tr>
				</tbody></table>
				</div>
		);
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
					isRequired
				/>
			<tr><td /><td /><td>
			{ progressButton }
			</td></tr>
			</tbody></table>
		</div>);
		const finishScreenContentGuest = (
			<div>
				<h1>Success!</h1>
				<h3>You are now registered as a guest!</h3> 
				<p>You may print or save your card below, you will also receive a confirmation email with your card attatched. </p>
				<p>Please bring your card along in print or on a mobile device when you visit the boathouse.</p>
				<p>You will have the option to print your card at the boathouse if you don't have a printer or mobile device available.</p>
				<a href="#" onClick={self.handlePrint}>Guest Card</a>
			</div>
		);

		const finishScreenContentRenter = (
			<div>
				<h1>Success!</h1>
				<h3>Your registration has been accepted!</h3> 
				<p>Please return this ticket to the front office and tell them you have completed registration online and would like to pay.</p>
				{/* <p>{this.state.createResults.map(r => r.ticketHTML.replace("$API_URL$", "")).getOrElse("")}</p> */}
				<iframe id="renterTicket" style={{height: "480px", width: "320px"}}></iframe>
			</div>
		);

		const finishScreenContent = (
			this.props.rentalMode == NONMEM_REG_FLOW.RENTAL
			? finishScreenContentRenter
			: finishScreenContentGuest
		);
		const agreeCheckbox = (<FactaNotitleRegion>
			<SingleCheckbox
				id="accept"
				label="I Agree To These Terms"

				updateAction={(id: string, waiverValue: any) => {
					self.setState({
						...this.state,
						waiverAccepted: (waiverValue === true)
					})
				}}
				value={self.state ? some(self.state.waiverAccepted) : none}
				justElement={true}
			/>
		</FactaNotitleRegion>);
		const adultWaiverContent = (<div id="adultwaiver">
			<table width="100%"><tbody>
				<tr>
					<td>
						<iframe title="Waiver of Liability" src="/waivers/live/ApGuestWaiver.html" width="100%" height="430px"></iframe>
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
							<iframe title="Waiver of Liability" src="/waivers/live/Under18GuestWaiver.html" width="100%" height="470px"></iframe>
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
				let now = moment();
				let dob = getDOBMoment(this.state);
				if(dob.isAfter(now.subtract(18, "years")))
					articleContent = under18WaiverContent;
				break;
			case PageState.FINISH:
				articleContent = finishScreenContent;
				// let the page render, then fill the iframe
				setTimeout(() => {
					const node: HTMLIFrameElement = document.getElementById("renterTicket") as HTMLIFrameElement;
					if (node) this.writeToDocument(node.contentDocument)
				}, 0)
				break;
		}

		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title={`${this.noun} Information`}>
				{ articleContent }
			</FactaArticleRegion>
		</FactaMainPage>
	}
}