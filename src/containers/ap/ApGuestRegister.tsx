import * as React from "react";
import { setAPImage } from "../../util/set-bg-image";
import FactaArticleRegion from "../../theme/facta/FactaArticleRegion";
import { History } from 'history'
import formUpdateState from '../../util/form-update-state';
import TextInput from '../../components/TextInput';
import Validation from '../../util/Validation';
//import FactaButton from '../../theme/facta/FactaButton';
import { Option, none } from 'fp-ts/lib/Option';
//import { jpBasePath } from "../../app/paths/jp/_base";
//import { Link } from "react-router-dom";
//import { apCreateAcctRoute } from "../../app/routes/ap/create-acct";
import FactaMainPage from "../../theme/facta/FactaMainPage";

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
	dob: none as Option<string>,
	phone: none as Option<string>,
	pw1: none as Option<string>,
	pw2: none as Option<string>,
	ecFirstName: none as Option<string>,
	ecLastName: none as Option<string>,
	ecPhone: none as Option<string>,
	ecRelationship: none as Option<string>
}

type Form = typeof defaultForm

class FormInput extends TextInput<Form> {}

const validate: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;

	const validations = [
		new Validation(isNotNull(state.formData.email), "Email must be specified."),
		new Validation(isNotNull(state.formData.pw1), "Password must be specified."),
		new Validation(state.formData.pw1.getOrElse("") == state.formData.pw2.getOrElse(""), "Passwords must be equal."),
		new Validation(state.formData.pw1.getOrElse("").length >= 6, "Password must be at least 6 characters long."),
	];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

export default class ApPreRegister extends React.PureComponent<Props, State> {
	
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
	}
	
	render() {
		const doRegister = () => {
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
		}
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
				<table><tbody>
					Guest Information
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
					<FormInput
						id="email"
						label="Email"
						isPassword={false}
						isRequired
						value={self.state.formData.email}
						updateAction={updateState}
					/>
					<FormInput
						id="phone"
						label="Phone Number"
						isPassword={false}
						isRequired
						value={self.state.formData.phone}
						appendToElementCell={<span style={{ color: "#777", fontSize: "0.8em" }}>  (No International Phone Numbers Please)</span>}
						updateAction={updateState}
					/>
					<FormInput
						id="dob"
						label="Birthday"
						isPassword={false}
						isRequired
						value={self.state.formData.dob}
						appendToElementCell={<span style={{ color: "#777", fontSize: "0.8em" }}>  (MM/DD/YYYY)</span>}
						updateAction={updateState}
						//extraCells={nextButton}
					/>
				</tbody></table>
</div>
				<div id="adultwaiver">
				<iframe title="Waiver of Liability" src="../../../waivers/live/ApGuestWaiver.html" width="100%" height="550px"></iframe>
				<table><tbody>
					AGREE BUTTON
				</tbody></table>
				</div>
				<div id="under18waiver">
				<iframe title="Waiver of Liability" src="../../../waivers/live/Under18GuestWaiver.html" width="100%" height="550px"></iframe>
				<table><tbody>
					AGREE BUTTON
				</tbody></table>
</div>
<div id="ecinfo">
				<b>Emergency Contact Information</b>
				<br />
					This should be someone close to you who is not going on the water with you.
				<br />
					For under 18 guests this should be a parent or guardian.
				<br />	
				<table><tbody>
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
						id="ecPhone"
						label="Phone Number"
						isPassword={false}
						isRequired
						value={self.state.formData.ecPhone}
						appendToElementCell={<span style={{ color: "#777", fontSize: "0.8em" }}>  (No International Phone Numbers Please)</span>}
						updateAction={updateState}
					/>
					<FormInput
						id="ecRelationship"
						label="Relationship"
						isPassword={false}
						isRequired
						value={self.state.formData.ecRelationship}
						updateAction={updateState}
						onEnter={doRegister}
						//extraCells={nextButton}
					/>
				</tbody></table>
</div>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
