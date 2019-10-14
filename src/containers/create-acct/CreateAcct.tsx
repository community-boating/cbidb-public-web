import { Option, none } from 'fp-ts/lib/Option';
import * as React from "react";
import TextInput from "../../components/TextInput";
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import Button from '../../components/Button';
import { History } from 'history';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import formUpdateState from '../../util/form-update-state';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import { preRegRender } from './ReserveClasses';
import { PreRegistration } from '../../app/global-state/jp-pre-registrations';
import { postWrapper as create } from '../../async/create-member'
import { PostJSON, PostString, PostURLEncoded } from '../../core/APIWrapper';
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import { Either } from 'fp-ts/lib/Either';
import Validation from '../../util/Validation';

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
	preRegistrations: PreRegistration[]
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

		const buttons = <div>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push("/reserve"))}/>
			<Button text="Register" onClick={() => {
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
							self.props.history.push("/")
						} else {
							self.setState({
								...self.state,
								validationErrors: res.message.split("\\n")
							})
						}
						return Promise.resolve();
					})
				}
			}}/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const main = (<React.Fragment>
			{errorPopup}
			<JoomlaArticleRegion title="First let's make you a parent account." buttons={buttons}>
				<table><tbody>
					<FormInput
						id="firstName"
						label="Parent First Name"
						isPassword={false}
						value={self.state.formData.firstName}
						updateAction={updateState}
					/>
					<FormInput
						id="lastName"
						label="Parent Last Name"
						isPassword={false}
						value={self.state.formData.lastName}
						updateAction={updateState}
					/>
					<FormInput
						id="email"
						label="Parent Email"
						isPassword={false}
						value={self.state.formData.email}
						updateAction={updateState}
					/>
					<FormInput
						id="pw1"
						label="Create Password"
						isPassword={true}
						value={self.state.formData.pw1}
						updateAction={updateState}
					/>
					<FormInput
						id="pw2"
						label="Confirm Password"
						isPassword={true}
						value={self.state.formData.pw2}
						updateAction={updateState}
					/>
				</tbody></table>
			</JoomlaArticleRegion>
		</React.Fragment>);

		const sidebarPrereg = (<JoomlaSidebarRegion title="Your Juniors"><table><tbody>
		{self.props.preRegistrations.length==0
			? <tr><td>As you reserve classes for more juniors, they will appear in this box!</td></tr>
			: self.props.preRegistrations.map(preRegRender(() => self.props.history.push("/redirect/create-acct")))
		}
		</tbody></table>

		</JoomlaSidebarRegion>);

		const sidebarInfo = <JoomlaSidebarRegion title="INFO">
			<div>
				Please supply an email address and password for your online account. Your account will allow you to register child(ren) for classes, renew their memberships, and sign them up for special Junior Program events.<br />
				<br />
				If you start the registration process and don't complete it, you can use this email/password to continue from where you left off.
			</div>
		</JoomlaSidebarRegion>
		return <Joomla8_4 main={main} right={(
			<React.Fragment>
				{sidebarInfo}
				{sidebarPrereg}
			</React.Fragment>
		)} />
	}
}