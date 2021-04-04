import * as React from "react";
import { setAPImage } from "../../util/set-bg-image";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import { History } from 'history'
import DateTriPicker, {  DateTriPickerProps } from "@components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps } from "@components/PhoneTriBox";
import formUpdateState from '../../util/form-update-state';
import TextInput from '../../components/TextInput';
//import Validation from '../../util/Validation';
//import FactaButton from '../../theme/facta/FactaButton';
import { Option, none } from 'fp-ts/lib/Option';
//import { jpBasePath } from "../../app/paths/jp/_base";
//import { Link } from "react-router-dom";
//import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";
import FactaMainPage from "../../theme/facta/FactaMainPage";
import * as moment from 'moment';
import range from "@util/range";

type Props = {
	history: History<any>
}


type State = {
	formData: Form,
	validationErrors: string[]
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

/*const validate: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;

	const validations = [
		new Validation(isNotNull(state.formData.email), "Email must be specified."),
		new Validation(isNotNull(state.formData.pw1), "Password must be specified."),
		new Validation(state.formData.pw1.getOrElse("") == state.formData.pw2.getOrElse(""), "Passwords must be equal."),
		new Validation(state.formData.pw1.getOrElse("").length >= 6, "Password must be at least 6 characters long."),
	];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}*/

export default class ApPreRegister extends React.PureComponent<Props, State> {
	
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
	}
	
	render() {
		/*const doRegister = () => {
			const validationResults = validate(this.state);
			if (validationResults.length > 0) {
				self.setState({
					...self.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				//TODO something here
				return null;
			}
		}*/
		const thisYear = Number(moment().format("YYYY"))
		const years = range(thisYear-120, thisYear-15)
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		//const nextButton = null;//(<FactaButton small key={"loginbutton-"} text="Next >" onClick={doRegister} spinnerOnClick forceSpinner={false}/>);
		
		const self=this;
		return <FactaMainPage setBGImage={setAPImage}>
			<FactaArticleRegion title="Register as a Guest">
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
</div>
				<div id="adultwaiver">
				<table width="100%"><tbody>
					<tr>
						<iframe title="Waiver of Liability" src="../../../waivers/live/ApGuestWaiver.html" width="100%" height="400px"></iframe>
					</tr>
					<tr>
						<td>Agree and Continue</td>
					</tr>
				</tbody></table>
				</div>
				<div id="under18waiver">
				<table width="100%"><tbody>
					<tr>
						<iframe title="Waiver of Liability" src="../../../waivers/live/Under18GuestWaiver.html" width="100%" height="400px"></iframe>
					</tr>
					<tr>
						<td>Agree and Continue</td>
					</tr>
				</tbody></table>
				</div>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
