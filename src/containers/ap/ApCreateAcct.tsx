import { Option, none } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from '../../components/TextInput';
import Validation from '../../util/Validation';
import formUpdateState from '../../util/form-update-state';
import FactaButton from '../../theme/facta/FactaButton';
import {FactaErrorDiv} from '../../theme/facta/FactaErrorDiv';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { apPreRegRoute } from '../../app/routes/ap/prereg';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import { setAPImage } from '../../util/set-bg-image';
import { postWrapper as create } from '@async/create-member'
import {History} from "history"
import { PostURLEncoded } from '../../core/APIWrapperUtil';
import { apBasePath } from '../../app/paths/ap/_base';
import asc from '../../app/AppStateContainer';
import {postWrapper as getProtoPersonCookie} from "@async/check-proto-person-cookie"

const defaultForm = {
	firstName: none as Option<string>,
	lastName: none as Option<string>,
	email: none as Option<string>,
	pw1: none as Option<string>,
	pw2: none as Option<string>
}

type Form = typeof defaultForm

type Props = {
	history: History<any>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

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

export default class ApCreateAcct extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
		getProtoPersonCookie.send(PostURLEncoded({}));
	}
	render() {
		const self= this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const doRegister = () => {
			const validationResults = validate(this.state);
			if (validationResults.length > 0) {
				self.setState({
					...self.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				return create.send(PostURLEncoded({
					username: self.state.formData.email.getOrElse(""),
					password: self.state.formData.pw1.getOrElse(""),
					firstName: self.state.formData.firstName.getOrElse(""),
					lastName: self.state.formData.lastName.getOrElse(""),
				})).then(res => {
					if (res.type == "Success") {
						self.props.history.push(apBasePath.getPathFromArgs({}))
						asc.updateState.setJustLoggedIn(true);
						asc.updateState.login.setLoggedIn(self.state.formData.email.getOrElse(""))
					} else {
						self.setState({
							...self.state,
							validationErrors: res.message.split("\\n")
						})
					}
					return Promise.resolve();
				})
			}
		}

		const buttons = <div>
			<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(apPreRegRoute.getPathFromArgs({})))}/>
			<FactaButton text="Register" spinnerOnClick onClick={doRegister}/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const main = (<React.Fragment>
			{errorPopup}
			<FactaArticleRegion title="First let's make you an account." buttons={buttons}>
				<table><tbody>
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
						id="pw1"
						label="Create Password"
						isPassword={true}
						isRequired
						value={self.state.formData.pw1}
						appendToElementCell={<span style={{color: "#777", fontSize: "0.8em"}}>  (Must be at least 6 characters long)</span>}
						updateAction={updateState}
						onEnter={doRegister}
					/>
					<FormInput
						id="pw2"
						label="Confirm Password"
						isPassword={true}
						isRequired
						value={self.state.formData.pw2}
						updateAction={updateState}
						onEnter={doRegister}
					/>
				</tbody></table>
			</FactaArticleRegion>
		</React.Fragment>);

		const sidebarInfo = (<JoomlaSidebarRegion title="INFO">
			<div>
			Please supply an email address and password for your online account.
			Your account will allow you to register for classes, renew your membership, and sign up for special events.<br />
			<br />
			If you start the registration process and don't complete it, you can use this email/password to continue from where you left off.
			</div>
		</JoomlaSidebarRegion>);

		return <Joomla8_4 setBGImage={setAPImage} main={main} right={sidebarInfo} />
	}
}
1
