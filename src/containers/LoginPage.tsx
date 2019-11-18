import { none, Option } from "fp-ts/lib/Option";
import * as React from "react";
import { Link } from "react-router-dom";
import { History } from 'history';

import Button from "../components/Button";
import PlaceholderLink from "../components/PlaceholderLink";
import TextInput from "../components/TextInput";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaTwoColumns from "../theme/joomla/JoomlaTwoColumns";
import Currency from "../util/Currency";
import formUpdateState from "../util/form-update-state";
import ErrorDiv from "../theme/joomla/ErrorDiv";
import {getWrapper as getProtoPersonCookie} from "../async/check-proto-person-cookie"
import { checkUpgradedAsValidationErrorArray } from "../util/checkUpgraded";

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}

interface Props {
	jpPrice: Option<Currency>,
	lastSeason: Option<number>,
	doLogin: (userName: string, password: string) => Promise<boolean>,
	history: History<any>
}

type State = {
	formData: typeof formDefault
	loginProcessing: boolean,
	validationErrors: string[]
};

class FormInput extends TextInput<typeof formDefault> {}

export default class LoginPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			formData: formDefault,
			loginProcessing: false,
			validationErrors: checkUpgradedAsValidationErrorArray(this.props.history, (process.env as any).eFuse)
		}
		getProtoPersonCookie.send(null)
	}
	loginFunction = () => {
		const self = this;
		if (!self.state.loginProcessing) {
			self.setState({
				...this.state,
				loginProcessing: true,
				validationErrors: []
			})
			return self.props.doLogin(self.state.formData.username.getOrElse(""), self.state.formData.password.getOrElse(""))
			.then(x => {
				if (!x) {
					self.setState({
						...self.state,
						formData: {
							...self.state.formData,
							password: none
						},
						loginProcessing: false,
						validationErrors: ["Login unsuccesful."]
					})
				}
			})
		}
		else return Promise.resolve();
	};
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const loginButton = (<Button key={"loginbutton-" + !!(this.state || {}).loginProcessing} text="LOGIN" onClick={this.loginFunction} spinnerOnClick forceSpinner={(this.state || {}).loginProcessing}/>);
		
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
					If you were looking for <b>{"Adult Program"}</b> registration, please <a href="https://portal2.community-boating.org/ords/f?p=610">click here!</a>
				</div>
			</JoomlaArticleRegion>
		);

		const scholarshipRegion = (
			<JoomlaArticleRegion title="Scholarships are available to provide sailing for all.">
				{self.props.jpPrice.isSome() ? `The price of a Junior Program membership is ${self.props.jpPrice.getOrElse(null).format(true)}.` : ""}
				{`
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
					{`If your child was a member last season, please use your email and password from last season, ` + 
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
							extraCells={ loginButton }
							value={self.state.formData.password}
							updateAction={updateState}
							onEnter={self.loginFunction}
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

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const leftColumn = <div>
			{welcomeRegion}
			{scholarshipRegion}
		</div>

		const rightColumn = <div>
			{newAcctRegion}
			{loginRegion}
			{inPersonRegion}
		</div>
		return (
			<JoomlaTwoColumns left={leftColumn} right={rightColumn}>
				{errorPopup}
			</JoomlaTwoColumns>
		);
	}
}
