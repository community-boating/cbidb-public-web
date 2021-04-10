import { none, Option } from "fp-ts/lib/Option";
import * as React from "react";
import { Link } from "react-router-dom";
import { History } from 'history';
import FactaButton from "@facta/FactaButton";
import TextInput from "@components/TextInput";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import formUpdateState from "@util/form-update-state";
import {FactaErrorDiv} from "@facta/FactaErrorDiv";
import {postWrapper as getProtoPersonCookie} from "@async/check-proto-person-cookie"
import { checkUpgradedAsValidationErrorArray } from "@util/checkUpgraded";
import Currency from "@util/Currency";
import { jpForgotPasswordPageRoute } from "@routes/jp/forgot-pw";
import { apForgotPasswordPageRoute } from "@routes/ap/forgot-pw";
import { setJPImage, setAPImage } from "@util/set-bg-image";
import { PageFlavor } from "@components/Page";
import { apPreRegRoute } from "@routes/ap/prereg";
import { apGuestRegRoute } from "@routes/ap/guest-reg";
import { jpClosedCovidPageRoute } from "@routes/jp/closed";
import { apPathStartClaimAcct } from "@paths/ap/start-claim-acct";
import { jpPathReserve } from "@paths/jp/reserve";
import asc from "@app/AppStateContainer";
import { jpBasePath } from "@paths/jp/_base";
import { apBasePath } from "@paths/ap/_base";
import { jpPathLogin } from "@paths/jp/login";
import { apPathLogin } from "@paths/ap/login";
import { PostURLEncoded } from "@core/APIWrapperUtil";
// import { apClosedPath } from "@paths/ap/closed";
import FactaSidebarPage from "@facta/FactaSidebarPage";
import { giftCertificatesPageRoute } from "@routes/gift-certificates";

export const formDefault = {
	username: none as Option<string>,
	password: none as Option<string>
}

interface Props {
	jpPrice: Option<Currency>,
	lastSeason: Option<number>,
	doLogin: (userName: string, password: string) => Promise<boolean>,
	history: History<any>,
	flavor: PageFlavor
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
		getProtoPersonCookie.send(PostURLEncoded({}))
	}
<<<<<<< HEAD
	//componentDidMount = () => {
	//	document.getElementById("username").focus();
	//}
=======
	componentDidMount = () => {
		window.setTimeout(() => {
			const node = document.getElementById("username");
			node.focus();
		}, 0);
	}
>>>>>>> master
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
				} else {
					const {checkFor, goTo} = (
						self.props.flavor == PageFlavor.JP
						? {checkFor: jpPathLogin.getPathFromArgs({}), goTo: jpBasePath.getPathFromArgs({})}
						: {checkFor: apPathLogin.getPathFromArgs({}), goTo: apBasePath.getPathFromArgs({})}
					);
					if (window.location.pathname == checkFor) {
						self.props.history.push(goTo)
					}
				}
			})
		}
		else return Promise.resolve();
	};
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const loginButton = (<FactaButton key={"loginbutton-" + !!(this.state || {}).loginProcessing} text="LOGIN" onClick={this.loginFunction} spinnerOnClick forceSpinner={(this.state || {}).loginProcessing}/>);
		
		// left column 

		const jpWelcomeRegion = (
			<FactaArticleRegion title={<span><b>Welcome to CBI Membership Online!</b><br />Junior Program Self Service Portal</span>}>
				<div>
					If you're new to Community Boating and would like to sign up for youth novice classes,
					choose the first option on the right. Once your child's registration is complete
					you can return here to sign up for additional classes throughout the season.
					Parents with existing accounts should use the second section to the right.
					New parents with experienced youth should contact the JP Directors or call the boathouse at 617-523-1038.
					<br />
					<br />
					If you were looking for <b>{"Adult Program"}</b> registration, please <Link to="/ap">click here!</Link>
				</div>
			</FactaArticleRegion>
		);

		const apWelcomeRegion = (
			<FactaArticleRegion title={<span><b>Welcome to CBI Membership Online! </b><br /> Adult Program Self Service Portal</span>}>
				<div>
				<a href="https://www.community-boating.org" target="_blank">Click here for our main website: www.community-boating.org</a>
				<br />
				If you are new to Community Boating and would like to purchase a membership now, <b>click on the first option</b> to the right.
				Once your account is complete you can return here to signup for classes and view your progression throughout the summer.<br />
				<br />
				If you have already purchased a membership in person, either this year or last year,
				please <b>click on the second option</b> to the right and you will be prompted to create a password and update your personal information.<br />
				<br />
				If you want to give the gift of membership, <b>click on the third option</b> to the right.
				<br />
				If you want to register as a guest so you can go sailing with a CBI member, click on the fourth option to the right to skip the line at the Front Desk and get your guest card right away!<br />
				<br />
				If you were looking for <b>Junior Program</b> registration, please <Link to="/jp">click here!</Link>
				</div>
			</FactaArticleRegion>
		);

		const jpPrice = self.props.jpPrice.getOrElse(Currency.dollars(375))

		const scholarshipRegion = (
			<FactaArticleRegion title="Reduced fee available to provide sailing for all.">
				We strive to make Junior Membership affordable to all.
				Our fee is on a generous need-based sliding scale from $1 to {jpPrice.format(true)} and includes membership, classes, and boat usage;
				everything we offer for ten summer weeks!
				During registration, our fee calculator considers household income and family makeup.
				Memberships are non-refundable and non-transferable. Register before Jan 1 to lock in last year's pricing!
			</FactaArticleRegion>
		);

		// right columns 

		const jpNewAcctRegion = (
			<FactaArticleRegion title="New CBI Parents...">
				<div>
					<Link to={asc.state.jpClosedCovid ? jpClosedCovidPageRoute.getPathFromArgs({}) : jpPathReserve.getPathFromArgs({})}>
						...click here to sign up your child(ren)!
					</Link>
					<br />
					<br />
					{`Existing parent account holders: sign in below to purchase memberships and sign up for classes.`}
				</div>
			</FactaArticleRegion>
		);

		const apNewAcctRegion = (
			<FactaArticleRegion title="I would like to...">
				<ul style={{fontSize: "0.92em"}}>
					<li><Link to={apPreRegRoute.getPathFromArgs({})}>Become an adult program member.</Link></li>
					<li><Link to={apPathStartClaimAcct.getPathFromArgs({})}>Activate my online account.</Link></li>
					{/* <li><Link to={apClosedPath.getPathFromArgs({})}>Click here if you are new to CBI.</Link></li> */}
					<li><Link to={giftCertificatesPageRoute.getPathFromArgs({})}>Purchase a gift certificate.</Link></li>
					<li><Link to={apGuestRegRoute.getPathFromArgs({})}>Register as a guest.</Link></li>
				</ul>
			</FactaArticleRegion>
		);

		const forgotPassword = (function() {
			switch (self.props.flavor) {
			case PageFlavor.AP:
				return apForgotPasswordPageRoute.getPathFromArgs({});
			case PageFlavor.JP:
				return jpForgotPasswordPageRoute.getPathFromArgs({});
			default:
				return null;
			}
		}());

		// TODO: some sort of spinner while a login attempt is actively running
		const loginRegion = (
			<FactaArticleRegion title="I already have an account.">
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
							size={23}
						/>
						<FormInput
							id="password"
							label="Password"
							isPassword={true}
							extraCells={ loginButton }
							value={self.state.formData.password}
							updateAction={updateState}
							onEnter={self.loginFunction}
							size={23}
						/>
						<tr><td></td><td><span>
							<Link to={forgotPassword}>I forgot my password!</Link>
						</span></td></tr>
					</tbody></table>
				</div>
			</FactaArticleRegion>
		);

		const inPersonRegion = (
			<FactaArticleRegion title="I purchased a membership in person.">
				<div>
					If you purchased a membership in person, you should have received an email with a link to set an account password.
					If you did not receive an email, click "I Forgot My Password" above and we'll send you an email <b>(IMPORTANT: use the same email address used for initial registration)</b>.
					If you still have difficulty accessing your account, please call the boathouse at 617-523-1038.
				</div>
			</FactaArticleRegion>
		)

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const {leftColumn, setBGImage, rightColumn} = (function() {
			switch(self.props.flavor) {
			case PageFlavor.JP:
				return {
					setBGImage: setJPImage,
					leftColumn: <div>
						{jpWelcomeRegion}
						{scholarshipRegion}
						{inPersonRegion}
					</div>,
					rightColumn: <div>
						{jpNewAcctRegion}
						{loginRegion}
					</div>
				};
			case PageFlavor.AP:
				return {
					setBGImage: setAPImage,
					leftColumn: <div>
						{apWelcomeRegion}
					</div>,
					rightColumn: <div>
						{apNewAcctRegion}
						{loginRegion}
					</div>
				};
			default:
				return null;
			}
		}());

		return (
			<FactaSidebarPage setBGImage={setBGImage} main={leftColumn} right={rightColumn}>
				{errorPopup}
			</FactaSidebarPage>
		);
	}
}
