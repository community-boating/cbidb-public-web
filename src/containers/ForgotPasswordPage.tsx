import { History } from 'history';
import * as React from "react";

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { Form as HomePageForm } from "./HomePage";
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../util/form-update-state';
import TextInput from '../components/TextInput';
import {apiw} from "../async/forgot-pw"
import { PostJSON, PostURLEncoded } from '../core/APIWrapper';
import { setFlagsFromString } from 'v8';
import ErrorDiv from '../theme/joomla/ErrorDiv';

type Props = {
	history: History<any>
}

type Form = {
	email: Option<string>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class ForgotPasswordPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				email: none
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
			self.setState({
				...self.state,
				validationErrors: []
			});
			return apiw.send(PostURLEncoded({ email: this.state.formData.email.getOrElse("") })).then(
				// api success
				ret => {
					if (ret.type == "Success") {
						self.props.history.push("/forgot-pw-sent")
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
		return <JoomlaMainPage>
			{errorPopup}
			<JoomlaArticleRegion title="Enter your email address and we'll get your password reset.">
				<table><tbody>
					<FormInput
						id="email"
						label="Email"
						value={this.state.formData.email}
						updateAction={updateState}
						onEnter={submit}
					/>
				</tbody></table>
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push("/"))}/>
			<Button text="Next >" onClick={submit}/>
		</JoomlaMainPage>
	}
}
