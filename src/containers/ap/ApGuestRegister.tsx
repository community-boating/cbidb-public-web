import * as React from "react";
import { setAPImage } from "../../util/set-bg-image";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import { History } from 'history'
import DateTriPicker, {  DateTriPickerProps } from "@components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps } from "@components/PhoneTriBox";
import formUpdateState from '../../util/form-update-state';
import TextInput from '../../components/TextInput';
import Validation from '../../util/Validation';
import FactaButton from '../../theme/facta/FactaButton';
import { Option, none } from 'fp-ts/lib/Option';
//import { jpBasePath } from "../../app/paths/jp/_base";
//import { Link } from "react-router-dom";
//import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";
import {FactaErrorDiv} from "@facta/FactaErrorDiv";
import FactaMainPage from "../../theme/facta/FactaMainPage";
import * as moment from 'moment';
import range from "@util/range";

type Props = {
	history: History<any>
}


type State = {
	formData: Form,
	validationErrors: string[],
	pageState: PageState
}

enum PageState{
	GUEST_INFORMATION,
	EMERGENCY_CONTACT,
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
		new Validation(isNotNull(state.formData.email), "Email must be specified."),
		new Validation(isNotNull(state.formData.firstName), "First Name must be specified.")
		];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

export default class ApPreRegister extends React.PureComponent<Props, State> {
	
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: [],
			pageState: PageState.GUEST_INFORMATION
		}
	}

	progressFunction = () => {
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
			})
			return Promise.resolve();
		}
	}
	
	render() {
		const thisYear = Number(moment().format("YYYY"))
		const years = range(thisYear-120, thisYear-15)
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const progressButton = (<FactaButton key={"key..."} text="next" onClick={this.progressFunction} spinnerOnClick forceSpinner={false}/>);
		
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
			At the end of registration you will have the option to print your ticket, receive an email ticket or a text code to use at the boathouse.
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
					extraCells={ progressButton }
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
			</tbody></table>
		</div>);

		const adultWaiverContent = (<div id="adultwaiver">
		<table width="100%"><tbody>
				<tr>
					<iframe title="Waiver of Liability" src="../../../waivers/live/ApGuestWaiver.html" width="100%" height="400px"></iframe>
				</tr>
				<tr>
					<td>Agree and Continue</td>
				</tr>
			</tbody></table>
		</div>);
		const under18WaiverContent = (
		<div id="under18waiver">
			<table width="100%"><tbody>
				<tr>
					<iframe title="Waiver of Liability" src="../../../waivers/live/Under18GuestWaiver.html" width="100%" height="400px"></iframe>
				</tr>
				<tr>
					<td>Agree and Continue</td>
				</tr>
			</tbody></table>
		</div>);

		var articleContent = formContent;

		if(this.state.pageState == PageState.WAIVER){
			articleContent = adultWaiverContent;
			const now = new Date();
			const DOB = new Date(parseInt(this.state.formData.dobYear.getOrElse("")), parseInt(this.state.formData.dobMonth.getOrElse("")), parseInt(this.state.formData.dobDay.getOrElse("")))
			if(Number(DOB) >= (Number(now) - 18 * 365 * 24 * 60 * 60 * 1000))
				articleContent = under18WaiverContent;
		}


		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title="Register as a Guest">
				{ articleContent }
				
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
