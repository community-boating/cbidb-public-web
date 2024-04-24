import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import { setMugarImage } from 'util/set-bg-image';
// import { DonationThirdPartyWidget } from 'components/DonationThirdPartyWidget';
import { none, Option, some } from 'fp-ts/lib/Option';
import {donationFundValidator} from "async/donation-funds"
import TextInput from 'components/TextInput';
import { RadioGroup } from 'components/InputGroup';
import { Select } from 'components/Select';
import formUpdateState from 'util/form-update-state';
import newPopWin from "util/newPopWin";
import {postWrapper as addDonation} from "async/add-donation-standalone"
import { makePostJSON, PostURLEncoded } from 'core/APIWrapperUtil';
import {postWrapper as getProtoPersonCookie} from "async/check-proto-person-cookie"
import FullCartReport from 'components/FullCartReport';
import { CartItem } from 'async/get-cart-items-donate';
import { PageFlavor } from 'components/Page';
import { Either, left, right } from 'fp-ts/lib/Either';
import { orderStatusValidator } from "async/order-status"
import standaloneLoginPath from "app/paths/common/standalone-signin"
import {apiw as detach} from "async/proto-detach-member"
import {postWrapper as savePersonData } from "async/member/donate-set-person"
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import FactaButton from 'theme/facta/FactaButton';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';

const FUND_ID = 1261

type DonationFund = t.TypeOf<typeof donationFundValidator>;

type Props = {
	history: History<any>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	donationFunds: DonationFund[],
	cartItems: CartItem[],
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

type Form = {
	selectedDonationAmount: Option<string>,
	otherAmount: Option<string>,
	promoCode: Option<string>,
	gcNumber: Option<string>,
	gcCode: Option<string>,
	inMemory: Option<string>,
	firstName: Option<string>,
	lastName: Option<string>,
	email: Option<string>,
	doRecurring: Option<string>,
}

type State = {
	formData: Form,
	validationErrors: string[],
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

enum Recurring {
	ONCE="One-Time",
	RECURRING="Monthly Recurring",
}

export default class MugarDonateDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const self = this;

		this.state = {
			formData: {
				selectedDonationAmount: none,
				otherAmount: none,
				promoCode: none,
				gcNumber: none,
				gcCode: none,
				inMemory: none,
				firstName: props.orderStatus.nameFirst,
				lastName: props.orderStatus.nameLast,
				email: props.orderStatus.email,
				doRecurring: this.props.orderStatus.paymentMethodRequired ? some(Recurring.RECURRING) : some(Recurring.ONCE),
			},
			validationErrors: [],
		}
	}
	validateDonationOtherAmt(): Either<string, number> {
		if (this.state.formData.selectedDonationAmount.getOrElse(null) != "Other") {
			return right(null);
		} else {
			const rawAmt = this.state.formData.otherAmount.getOrElse("");
			const removeDollarSignAndCommas = Number(rawAmt.replace(/\$/g, "").replace(/,/g, ""));
			if (isNaN(removeDollarSignAndCommas)) {
				return left("Donation amount is invalid"); 
			} else {
				return right(removeDollarSignAndCommas);
			}
		}
	}
	clearErrors() {
		this.setState({
			...this.state,
			validationErrors: []
		})
	}
	doAddDonation(): Promise<void> {
		const self = this;
		this.clearErrors();

		const errorOrOtherAmt: Either<string, number> = (function() {
			const selectedAmount = self.state.formData.selectedDonationAmount.getOrElse("None");
			if (selectedAmount == "None") {
				return left("No donation amount selected.") as Either<string, number>
			} else if (selectedAmount == "Other") {
				return self.validateDonationOtherAmt();
			} else {
				return right(Number(selectedAmount)) as Either<string, number>
			}
		}());

		if (errorOrOtherAmt.isLeft()) {
			window.scrollTo(0, 0);
			this.setState({
				...this.state,
				validationErrors: [errorOrOtherAmt.swap().getOrElse(null)]
			});
			return Promise.reject()
		} else {
			return getProtoPersonCookie.sendJson({}).then(() => addDonation.sendJson({
				fundId: FUND_ID,
				amount: errorOrOtherAmt.getOrElse(null),
				inMemoryOf: this.state.formData.inMemory,
				nameFirst: this.state.formData.firstName,
				nameLast: this.state.formData.lastName,
				email: this.state.formData.email,
				doRecurring: some(false)
			}))
			.then(ret => {
				console.log(ret)
				if (ret.type == "Success") {
					// self.props.history.push("/redirect" + window.location.pathname)
					return Promise.resolve()
				} else {
					window.scrollTo(0, 0);
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					});
					return Promise.reject()
				}
			})
		}
	}
	doSubmit(): Promise<any> {
		const self = this;
		this.clearErrors();
		// debugger;

		return this.doAddDonation()
		.then(() => getProtoPersonCookie.sendJson({}).then(() => savePersonData.sendJson({
			nameFirst: self.state.formData.firstName,
			nameLast: self.state.formData.lastName,
			email: self.state.formData.email,
			doRecurring: false,
		})).then(ret => {
			console.log("savePersonData", ret)
			// debugger;
			if (ret.type == "Success") {
				self.props.goNext();
			} else {
				console.log("err", ret.message.split("\\n"))
				window.scrollTo(0, 0);
				self.setState({
					...self.state,
					validationErrors: ret.message.split("\\n") // TODO
				});
				return Promise.reject()
			}
		}));
		
	}
	render() {
		const self = this
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const donationAmountCell = (<div>
			Please select gift amount:<br />
			<FormRadio
				id="selectedDonationAmount"
				justElement={true}
				columns={3}
				values={[{
					key: "50",
					display: "$50"
				}, {
					key: "100",
					display: "$100"
				}, {
					key: "250",
					display: "$250"
				}, {
					key: "500",
					display: "$500"
				}, {
					key: "1000",
					display: "$1000"
				}, {
					key: "Other",
					display: "Other"
				}]}
				updateAction={updateState}
				value={this.state.formData.selectedDonationAmount || none}
			/>
			{
				(this.state.formData.selectedDonationAmount.getOrElse(null) == "Other")
				? 
				<table style={{marginBottom: "3px"}}><tbody>
					<FormInput
						id="otherAmount"
						label="$"
						value={this.state.formData.otherAmount}
						updateAction={updateState}
						size={10}
						maxLength={10}
					/>
				</tbody></table>
				: null
			}
		</div>)

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors} dontEscapeHTML />
			: ""
		);

		const ifStarted = <React.Fragment>
			<FactaArticleRegion title="Personal Info">
				{!self.props.orderStatus.authedAsRealPerson
					? <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
						If you have an online account already, <a href="#" onClick={() => newPopWin(standaloneLoginPath.getPathFromArgs({}), 1100, 800)}>
							click here to sign in</a>!
					</span>
					: <span style={{color: "#555", fontSize: "0.9em", fontStyle: "italic"}}>
						Thank you for signing in! <a href="#" onClick={() => detach.sendFormUrlEncoded({}).then(() => {
							self.props.history.push("/redirect" + window.location.pathname)
						})}>Click here if you would like to sign back out</a>.
					</span>
				}
				<table><tbody>
					<FormInput
						id="firstName"
						label="First Name"
						value={this.state.formData.firstName}
						updateAction={updateState}
						size={30}
						maxLength={255}
						isRequired
						disabled={this.props.orderStatus.authedAsRealPerson}
					/>
					<FormInput
						id="lastName"
						label="Last Name"
						value={this.state.formData.lastName}
						updateAction={updateState}
						size={30}
						maxLength={255}
						isRequired
						disabled={this.props.orderStatus.authedAsRealPerson}
					/>
					<FormInput
						id="email"
						label="Email"
						value={this.state.formData.email}
						updateAction={updateState}
						size={30}
						maxLength={255}
						isRequired
						disabled={this.props.orderStatus.authedAsRealPerson}
					/>
				</tbody></table>
			</FactaArticleRegion>
			<FactaButton text="Next >" spinnerOnClick onClick={this.doSubmit.bind(this)} />
		</React.Fragment>;

		const title = <span>Community Boating, Inc (CBI) and the family and friends of David Mugar
		have established this fund in memory of David Mugar to commemorate and educate the public of Mugar's
		extensive contributions to the Boston community.</span>

		return (
			<FactaMainPage setBGImage={setMugarImage}>
				{errorPopup}
				<FactaArticleRegion title={title}>
					The David Mugar statue fund will support the construction and installation of a statue of David Mugar.  The sculpture will be a tribute to the life and legacy of Mugar in recognition for everything he accomplished and did in Boston for the greater good of the community.  The sculpture will be located on the Esplanade adjacent to the Hatch Shell.  Any funds not used as part of the Statue project will support and enhance program enrichment for CBI's <a target="_blank" href="https://www.community-boating.org/junior/welcome">Junior Program</a>.
					<br />
					
				</FactaArticleRegion>
				{donationAmountCell}
				<table><tbody><tr>
					<td style={{width: "50%", verticalAlign: "top"}}>
					
					{ifStarted}
					</td>	
					<td style={{width: "50%", verticalAlign: "top"}}>
						If you would like to make a donation by check or donor-advised fund, please send your contribution to:<br />
						Community Boating, Inc. <br />
						21 David G Mugar Way<br />
						Boston, MA 02114<br />
						<br />
						In the Check or Donation letter, include Mention of the "DAVID MUGAR STATUE FUND" 
					</td>
				</tr></tbody></table>
				
			</FactaMainPage>
		)
	}
}