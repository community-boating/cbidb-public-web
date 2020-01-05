import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../util/form-update-state';
import TextInput from '../components/TextInput';
import {apiw} from "../async/reset-pw"
import { PostURLEncoded } from '../core/APIWrapper';
import Validation from '../util/Validation'
import ErrorDiv from '../theme/joomla/ErrorDiv';
import asc from '../app/AppStateContainer';

type Props = {
	history: History<any>,
	email: string,
	hash: string
}

type Form = {
	pw1: Option<string>,
	pw2: Option<string>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

const validate: (state: State) => string[] = state => {
	const isNotNull = (os: Option<string>) => os.isSome() && os.getOrElse("").length > 0;

	const validations = [
		new Validation(isNotNull(state.formData.pw1), "Password must be specified."),
		new Validation(state.formData.pw1.getOrElse("") == state.formData.pw2.getOrElse(""), "Passwords must be equal."),
		new Validation(state.formData.pw1.getOrElse("").length >= 6, "Password must be at least 6 characters long."),
	];

	return validations.filter(v => !v.pass).map(v => v.errorString);
}

export default class NewPasswordPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				pw1: none,
				pw2: none
			},
			validationErrors: []
		}
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);
		const submit = () => {
			const validationResults = validate(this.state);
			if (validationResults.length > 0) {
				self.setState({
					...self.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				return apiw.send(PostURLEncoded({ username: this.props.email, hash: this.props.hash, password: this.state.formData.pw1.getOrElse("") })).then(
					// api success
					ret => {
						if (ret.type == "Success") {
							self.props.history.push("/")
							asc.updateState.login.setLoggedIn(self.props.email)
						} else {
							window.scrollTo(0, 0);
							self.setState({
								...self.state,
								validationErrors: ret.message.split("\\n") // TODO
							});
						}
					}
				)
			}
		}
		return <JoomlaMainPage>
			{errorPopup}
			<JoomlaArticleRegion title="Enter your new password.">
				<table><tbody>
					<FormInput
						id="pw1"
						label="Enter Password"
						value={this.state.formData.pw1}
						isPassword
						updateAction={updateState}
					/>
					<FormInput
						id="pw2"
						label="Confirm Password"
						value={this.state.formData.pw2}
						isPassword
						updateAction={updateState}
						onEnter={submit}
					/>
				</tbody></table>
			</JoomlaArticleRegion>
			<Button text="Submit" onClick={submit}/>
		</JoomlaMainPage>
	}
}
