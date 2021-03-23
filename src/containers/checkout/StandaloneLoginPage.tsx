import * as React from "react";
import {History} from 'history';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import { setCheckoutImage } from "../../util/set-bg-image";
import TextInput from "../../components/TextInput";
import { none, Option } from "fp-ts/lib/Option";
import formUpdateState from "../../util/form-update-state";
import Button from "../../components/Button";
import {apiw as proveMember} from "@async/prove-member"
import { makePostString } from "../../core/APIWrapperUtil";
import {JoomlaErrorDiv} from "../../theme/joomla/JoomlaErrorDiv";
import JoomlaButton from "../../theme/joomla/JoomlaButton";

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}

interface Props {
	history: History<any>,
}

type State = {
	formData: typeof formDefault
	loginProcessing: boolean,
	validationErrors: string[]
};

class FormInput extends TextInput<typeof formDefault> {}

export default class StandaloneLoginPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			formData: formDefault,
			loginProcessing: false,
			validationErrors: []
		}
	}
	componentDidMount() {
		setCheckoutImage()
		document.getElementById("rt-showcase").remove()
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		
		const loginFunction = () => {
			if (!self.state.loginProcessing) {
				self.setState({
					...this.state,
					loginProcessing: true,
					validationErrors: []
				})
				const payload = makePostString("username=" + encodeURIComponent(this.state.formData.username.getOrElse("")) + "&password=" + encodeURIComponent(this.state.formData.password.getOrElse("")))
				return proveMember.send(payload).then(res => {
					if (res.type == "Success" && res.success) {
						window.opener.location.reload();
						window.close();
					} else {
						this.setState({
							...self.state,
							formData: {
								...self.state.formData,
								password: none
							},
							loginProcessing: false,
							validationErrors: ["Login unsuccesful."]
						})
					}
					return Promise.resolve();
				})
			}
			else return Promise.resolve();
		}
		const loginButton = (<JoomlaButton key={"loginbutton-" + !!(this.state || {}).loginProcessing} text="LOGIN" onClick={loginFunction} spinnerOnClick forceSpinner={(this.state || {}).loginProcessing}/>);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <JoomlaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <JoomlaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<JoomlaArticleRegion title={"Sign In"}>
			<table><tbody>
				<FormInput
					id="username"
					label="Email"
					isPassword={false}
					value={self.state.formData.username}
					updateAction={updateState}
				/>
				<FormInput
					id="password"
					label="Password"
					isPassword={true}
					extraCells={ loginButton }
					value={self.state.formData.password}
					updateAction={updateState}
					onEnter={loginFunction}
				/>
			</tbody></table>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
