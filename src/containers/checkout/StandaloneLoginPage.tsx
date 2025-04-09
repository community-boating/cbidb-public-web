import * as React from "react";
import {History} from 'history';
import { setCheckoutImage } from "util/set-bg-image";
import TextInput from "components/TextInput";
import { none, Option, some } from "fp-ts/lib/Option";
import {apiw as prove} from "async/prove-member";
import formUpdateState from "util/form-update-state";
import FactaMainPage from "theme/facta/FactaMainPage";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaButton from "theme/facta/FactaButton";
import asc from "app/AppStateContainer";
import { PostURLEncoded } from "core/APIWrapperUtil";

export function formDefault (username: string) {return ({
	username: ((username || "") == "") ? none : some(username.substring(1)),
	password: none as Option<string>
})}

interface Props {
	history: History<any>
}

type State = {
	formData: {
		username: Option<string>
		password: Option<string>
	}
	loginProcessing: boolean,
	validationErrors: string[]
};

class FormInput extends TextInput<State['formData']> {}

export default class StandaloneLoginPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			formData: formDefault(window.location.hash),
			loginProcessing: false,
			validationErrors: []
		}
	}
	componentDidMount() {
		setCheckoutImage()
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const loginFunction = () => {
			if (!self.state.loginProcessing) {
				self.setState({
					...self.state,
					loginProcessing: true,
					validationErrors: []
				})
				const login: Promise<any> = asc.updateState.login.attemptLogin(self.state.formData.username.getOrElse(""), self.state.formData.password.getOrElse(""))
				return login.then(res => {
					if (res) {
						prove.send(PostURLEncoded("")).then(a => {
							window.opener.location.reload();
						window.close();
						})
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
		const loginButton = (<FactaButton key={"loginbutton-" + !!(this.state || {}).loginProcessing} text="LOGIN" onClick={loginFunction} spinnerOnClick forceSpinner={(this.state || {}).loginProcessing}/>);

		return <FactaMainPage setBGImage={setCheckoutImage} errors={this.state.validationErrors}>
			<FactaArticleRegion title={"Sign In"}>
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
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
