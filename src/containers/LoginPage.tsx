import { none, Option } from "fp-ts/lib/Option";
import * as React from "react";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import PlaceholderLink from "../components/PlaceholderLink";
import TextInput from "../components/TextInput";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency";
import formUpdateState from "../util/form-update-state";


// export const formName = "login"

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}


// const mapStateToProps = (rootState: RootState) => ({

// 	form: {
// 		username: rootState.loginForm.data.map(d => d.username).getOrElse(null),
// 		password: rootState.loginForm.data.map(d => d.password).getOrElse(null)
// 	},
// 	selfServerParams: rootState.staticState.selfServerParams
// })

// const mapDispatchToProps = (dispatch: Dispatch) => ({
// 	login: (selfServerParams: ServerParams, form: Form) => login(selfServerParams)(dispatch, form.username.getOrElse(""), form.password.getOrElse("")),
// 	updateField: (name: keyof Form, value: string) => dispatchFormUpdate(dispatch, formName)(name, value)
// })

interface Props {
	jpPrice: Currency,
	lastSeason: number,
	doLogin: (userName: string, password: string) => Promise<boolean>
}

type State = {
	formData: typeof formDefault
};

class FormInput extends TextInput<typeof formDefault> {}

export default class LoginPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			formData: formDefault
		}
	}
	render() {
		console.log("login page props: ", this.props)
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const loginFunction = () => {
			self.props.doLogin(self.state.formData.username.getOrElse(""), self.state.formData.password.getOrElse(""))
			.then(x => {
				console.log("about to update login page ", x)
				if (!x) {
					self.setState({
						...self.state,
						formData: {
							...self.state.formData,
							password: none
						}
					})
				}
			})
		};
		
		// left column 

		const welcomeRegion = (
			<JoomlaArticleRegion title={<span>Welcome to CBI Online!<br />-  Junior Program  -</span>}>
				<div>
					If you are new to Community Boating and would like to purchase a Junior Program membership for your child,
					<b>{" click on the first option "}</b>
					{"to the right.  Once your child's registration is complete you can return here to sign him/her up "}
					for classes and view his/her progression throughout the summer.
					<br />
					<br />
					If you were looking for <b>{"Adult Program"}</b> registration, please <PlaceholderLink>click here!</PlaceholderLink>
				</div>
			</JoomlaArticleRegion>
		);

		const scholarshipRegion = (
			<JoomlaArticleRegion title="Scholarships are available to provide sailing for all.">
				{`
					The price of a Junior Program membership is ${self.props.jpPrice.format(true)}.
					Community Boating Inc. provides scholarships for families in need
					so that every child has an opportunity to enroll in the Junior Program.
					To find out if you qualify for a scholarship,
					please create an account and fill out the scholarship form.
				`}
			</JoomlaArticleRegion>
		);


		// right columns 

		const newAcctRegion = (
			<JoomlaArticleRegion title="My child and I are new to Community Boating.">
				<div>
					<ul style={{ fontSize: "0.92em", marginLeft: "20px" }}>
						<li><Link to="/precreate">
							Click here to create a parent account.
						</Link></li>
					</ul>
					<br />
					{`If your child was a member in ${self.props.lastSeason}, please use your email and password from last season, ` + 
					`rather than creating a new account.`}
				</div>
			</JoomlaArticleRegion>
		);

		// TODO: some sort of spinner while a login attempt is actively running
		const loginRegion = (
			<JoomlaArticleRegion title="I already have an account.">
				<div>
					Enter your email address and password to continue.
					<br />
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
							extraCells={ <Button text="LOGIN" onClick={loginFunction} /> }
							value={self.state.formData.password}
							updateAction={updateState}
							onEnter={loginFunction}
						/>
						<tr><td></td><td><span>
							<PlaceholderLink >I forgot my password!</PlaceholderLink>
						</span></td></tr>
					</tbody></table>
				</div>
			</JoomlaArticleRegion>
		);

		const inPersonRegion = (
			<JoomlaArticleRegion title="I purchased a membership in person.">
				<div>
					{`If you have already purchased a membership for this year in person,
					you should have received an email with a link to set a password for your account.
					If you did not receive the email, click \"I Forgot My Password\" to the right
					and we will send you another `}
					<b>(IMPORTANT: Be sure to use the same email address used for initial registration)</b>
					{`. If you still have difficulty accessing your account, please call the boathouse at 617-523-1038.`}
				</div>
			</JoomlaArticleRegion>
		)

		const leftColumn = <div>
			{welcomeRegion}
			{scholarshipRegion}
		</div>

		const rightColumn = <div>
			{newAcctRegion}
			{loginRegion}
			{inPersonRegion}
		</div>
		return <JoomlaTwoColumns left={leftColumn} right={rightColumn}></JoomlaTwoColumns>
	}
}
