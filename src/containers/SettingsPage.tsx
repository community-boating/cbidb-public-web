import * as React from "react";
import Button from '../components/Button';
import JoomlaArticleRegion from '../theme/joomla/JoomlaArticleRegion';
import { setAPImage, setJPImage } from '../util/set-bg-image';
import {History} from "history"
import JoomlaMainPage from '../theme/joomla/JoomlaMainPage';
import { Option, none } from "fp-ts/lib/Option";
import asc from "../app/AppStateContainer";
import TextInput from "../components/TextInput";
import formUpdateState from "../util/form-update-state";
import { apBasePath } from "../app/paths/ap/_base";
import ErrorDiv from "../theme/joomla/ErrorDiv";
import {apiw as submit} from "../async/update-acct"
import { PostURLEncoded } from "../core/APIWrapperUtil";
import { PageFlavor } from "../components/Page";
import { jpBasePath } from "../app/paths/jp/_base";

type Form = {
	email: Option<string>,
	oldPw: Option<string>,
	newPw1: Option<string>,
	newPw2: Option<string>
}

type Props = {
	history: History<any>,
	pageFlavor: PageFlavor,
}

type State = {
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}

export default class SettingsPage extends React.PureComponent<Props, State> {
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

		const returnRoute = (
			this.props.pageFlavor == PageFlavor.JP
			? jpBasePath.getPathFromArgs({})
			: apBasePath.getPathFromArgs({})
		);

		const doSubmit = () => {
			const validationResults = SettingsPage.validate(this.state);
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
						self.props.history.push(returnRoute);
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
			<Button text="< Cancel" onClick={() => Promise.resolve(this.props.history.push(returnRoute))}/>
			<Button text="Apply Changes" onClick={doSubmit} spinnerOnClick/>
		</div>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const setBgImage = (
			this.props.pageFlavor == PageFlavor.JP
			? setJPImage
			: setAPImage
		);

		return <JoomlaMainPage setBGImage={setBgImage}>
		{errorPopup}
			<JoomlaArticleRegion title="Edit Account Info" buttons={buttons}>
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
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
