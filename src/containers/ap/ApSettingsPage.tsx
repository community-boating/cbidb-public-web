import * as React from "react";
import JoomlaButton from '../../theme/joomla/JoomlaButton';
import FactaArticleRegion from '../../theme/facta/FactaArticleRegion';
import { setAPImage } from '../../util/set-bg-image';
import {History} from "history"
import { Option, none } from "fp-ts/lib/Option";
import asc from "../../app/AppStateContainer";
import TextInput from "../../components/TextInput";
import formUpdateState from "../../util/form-update-state";
import { apBasePath } from "../../app/paths/ap/_base";
import {FactaErrorDiv} from "../../theme/facta/FactaErrorDiv";
import {apiw as submit} from "../../async/update-acct"
import { PostURLEncoded } from "../../core/APIWrapperUtil";
import FactaMainPage from "../../theme/facta/FactaMainPage";

type Form = {
	email: Option<string>,
	oldPw: Option<string>,
	newPw1: Option<string>,
	newPw2: Option<string>
}

type Props = {
	history: History<any>
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class ApSettingsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				email: asc.state.login.authenticatedUserName,
				oldPw: none,
				newPw1: none,
				newPw2: none
			},
			validationErrors: []
		}
	}
	static validate(state: State): string[] {
		var errors = [];
		// current password must be specified to do anything
		if (state.formData.oldPw.isNone()) {
			errors.push("Current password must be specified to change your information");
		}

		if (state.formData.newPw1.isSome() || state.formData.newPw2.isSome()) {
			if (state.formData.newPw1.getOrElse("") != state.formData.newPw2.getOrElse("")) {
				errors.push("New passwords do not match.");
			}
			if (state.formData.newPw1.getOrElse("").length < 6) {
				errors.push("Password must be at least 6 characters long.");
			}
		}
		return errors;
	}
	render() {
		const self = this;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const doSubmit = () => {
			const validationResults = ApSettingsPage.validate(this.state);
			if (validationResults.length > 0) {
				self.setState({
					...self.state,
					validationErrors: validationResults
				})
				return Promise.resolve();
			} else {
				return submit.send(PostURLEncoded({
					username: asc.state.login.authenticatedUserName.getOrElse(""), 
					password: self.state.formData.oldPw.getOrElse(""),
					newUsername: self.state.formData.email.getOrElse(""),
					newPassword: self.state.formData.newPw1.getOrElse("")
				})).then(ret => {
					if (ret.type == "Success") {
						const email = self.state.formData.email.getOrElse("");
						if (email.length > 0) {
							asc.updateState.login.setLoggedIn(email);
						}
						self.props.history.push(apBasePath.getPathFromArgs({}));
					} else {
						window.scrollTo(0, 0);
						self.setState({
							...self.state,
							validationErrors: ret.message.split("\\n") // TODO
						});
					}
				});
			}
		}

		const buttons = <div>
			<JoomlaButton text="< Cancel" onClick={() => Promise.resolve(this.props.history.push(apBasePath.getPathFromArgs({})))}/>
			<JoomlaButton text="Apply Changes" onClick={doSubmit} spinnerOnClick/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setAPImage}>
		{errorPopup}
			<FactaArticleRegion title="Edit Account Info" buttons={buttons}>
				<table><tbody>
					<FormInput
						id="email"
						label="Email"
						isPassword={false}
						value={self.state.formData.email}
						updateAction={updateState}
					/>
					<FormInput
						id="oldPw"
						label="Current Password"
						isPassword={true}
						value={self.state.formData.oldPw}
						updateAction={updateState}
					/>
					<FormInput
						id="newPw1"
						label="Change Password"
						isPassword={true}
						value={self.state.formData.newPw1}
						updateAction={updateState}
					/>
					<FormInput
						id="newPw2"
						label="Confirm Password"
						isPassword={true}
						value={self.state.formData.newPw2}
						updateAction={updateState}
						onEnter={doSubmit}
					/>
				</tbody></table>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
