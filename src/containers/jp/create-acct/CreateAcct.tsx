import { Option, none } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from "../../../components/TextInput";
import JoomlaButton from '../../../theme/joomla/JoomlaButton';
import { History } from 'history';
import FactaArticleRegion from '../../../theme/facta/FactaArticleRegion';
import formUpdateState from '../../../util/form-update-state';
import JoomlaSidebarRegion from '../../../theme/joomla/JoomlaSidebarRegion';
import Joomla8_4 from '../../../theme/joomla/Joomla8_4';
import { preRegRender } from './ReserveClasses';
import { PreRegistration } from '../../../app/global-state/jp-pre-registrations';
import { postWrapper as create } from '../../../async/create-member'
import { PostURLEncoded } from '../../../core/APIWrapperUtil';
import {FactaErrorDiv} from '../../../theme/facta/FactaErrorDiv';
import Validation from '../../../util/Validation';
import asc from '../../../app/AppStateContainer';
import {reservePageRoute} from "../../../app/routes/jp/reserve"
import { createAcctPageRoute } from '../../../app/routes/jp/create-acct';
import { setJPImage } from '../../../util/set-bg-image';
import { jpBasePath } from '../../../app/paths/jp/_base';

const defaultForm = {
	firstName: none as Option<string>,
	lastName: none as Option<string>,
	email: none as Option<string>,
	pw1: none as Option<string>,
	pw2: none as Option<string>
}

type Form = typeof defaultForm

type Props = {
	history: History<any>,
	preRegistrations: PreRegistration[],
	noSignupJuniors: string[]
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

export default class CreateAccount extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm,
			validationErrors: []
		}
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
						self.props.history.push(jpBasePath.getPathFromArgs({}))
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
			<JoomlaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(reservePageRoute.getPathFromArgs({})))}/>
			<JoomlaButton text="Register" spinnerOnClick onClick={doRegister}/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const main = (<React.Fragment>
			{errorPopup}
			<FactaArticleRegion title="Let's make you a parent account." buttons={buttons}>
				<table><tbody>
					<FormInput
						id="firstName"
						label="Parent First Name"
						isPassword={false}
						isRequired
						value={self.state.formData.firstName}
						updateAction={updateState}
					/>
					<FormInput
						id="lastName"
						label="Parent Last Name"
						isPassword={false}
						isRequired
						value={self.state.formData.lastName}
						updateAction={updateState}
					/>
					<FormInput
						id="email"
						label="Parent Email"
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

		const sidebarPrereg = (<JoomlaSidebarRegion title="Your Juniors"><table><tbody>
		{self.props.preRegistrations.length==0
			? <tr><td>You have no reserved any classes yet.  This is ok; you can always sign up for classes after purchasing a membership.</td></tr>
			: self.props.preRegistrations.map(preRegRender(() => self.props.history.push(`/redirect${createAcctPageRoute.getPathFromArgs({})}`)))
		}
		</tbody></table>

		</JoomlaSidebarRegion>);

		const sidebarInfo = <JoomlaSidebarRegion title="INFO">
			<div>
				Your account will allow you to register your child(ren) for classes, track their progress, and renew their memberships.<br />
				<br />
				If you start the registration process and don't complete it, you can use this email/password to finish at a later date.
				Note that class sign-up is only saved for two hours.
			</div>
		</JoomlaSidebarRegion>
		return <Joomla8_4 setBGImage={setJPImage} main={main} right={(
			<React.Fragment>
				{sidebarInfo}
				{sidebarPrereg}
			</React.Fragment>
		)} />
	}
}
