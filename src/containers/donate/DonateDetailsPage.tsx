import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import { setCheckoutImageForDonations } from 'util/set-bg-image';
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
import {postWrapper as savePersonData } from "async/member/donate-set-person"
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import FactaButton from 'theme/facta/FactaButton';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import optionify from 'util/optionify';
import {apiw as detach} from "async/proto-detach-member"
import StandalonePurchaserInfo from 'components/StandalonePurchaserInfo';

type DonationFund = t.TypeOf<typeof donationFundValidator>;

type Props = {
	history: History<any>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	donationFunds: DonationFund[],
	cartItems: CartItem[],
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
	fundCode: Option<string>
}

type Form = {
	selectedDonationAmount: Option<string>,
	selectedFund: Option<string>,
	otherAmount: Option<string>,
	promoCode: Option<string>,
	gcNumber: Option<string>,
	gcCode: Option<string>,
	inMemory: Option<string>,
	purchaserNameFirst: Option<string>,
	purchaserNameLast: Option<string>,
	email: Option<string>,
	doRecurring: Option<string>,
}

type State = {
	availableFunds: DonationFund[],
	formData: Form,
	validationErrors: string[],
	hasPersonWarning: boolean
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

enum Recurring {
	ONCE="One-Time",
	RECURRING="Monthly Recurring",
}

// TODO: should be data driven
const fundCodeToId = (code: string) => {
	switch (code){
	case "priebatsch":
		return some(MAGIC_NUMBERS.DONATION_FUND_ID.PRIEBATSCH_ENDOWMENT)
	case "jpoperations":
		return some(MAGIC_NUMBERS.DONATION_FUND_ID.JP_OPERATIONS)
	case "jpstem":
		return some(MAGIC_NUMBERS.DONATION_FUND_ID.JP_STEM)
	default:
		return none;
	}
}

export default class DonateDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const self = this;
		const fundIsUnused = (fund: t.TypeOf<typeof donationFundValidator>) => {
			return !this.props.cartItems.find(item => item.fundId.getOrElse(null) == fund.fundId)
		}

		const availableFunds = this.props.donationFunds.filter(fundIsUnused)

		const selectedFund = (function() {
			if (availableFunds.length == 0) return none;
			else {
				const fund = self.props.fundCode
					.chain(fundCodeToId)
					.chain(id => optionify(availableFunds.find(f => f.fundId == id)))
					.getOrElse(availableFunds[0]);
				return some(String(fund.fundId))
			}
		}());

		this.state = {
			availableFunds,
			formData: {
				selectedDonationAmount: none,
				selectedFund: selectedFund,
				otherAmount: none,
				promoCode: none,
				gcNumber: none,
				gcCode: none,
				inMemory: none,
				purchaserNameFirst: props.orderStatus.nameFirst,
				purchaserNameLast: props.orderStatus.nameLast,
				email: props.orderStatus.email,
				doRecurring: this.props.orderStatus.paymentMethodRequired ? some(Recurring.RECURRING) : some(Recurring.ONCE),
			},
			validationErrors: [],
			hasPersonWarning: false
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
	doAddDonation() {
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
			return Promise.resolve()
		} else {
			return getProtoPersonCookie.send(PostURLEncoded({})).then(() => addDonation.send(makePostJSON({
				fundId: this.state.formData.selectedFund.map(Number).getOrElse(null),
				amount: errorOrOtherAmt.getOrElse(null),
				inMemoryOf: this.state.formData.inMemory,
				nameFirst: this.state.formData.purchaserNameFirst,
				nameLast: this.state.formData.purchaserNameLast,
				email: this.state.formData.email,
				doRecurring: this.state.formData.doRecurring.map(r => r == Recurring.RECURRING)
			})))
			.then(ret => {
				if (ret.type == "Success") {
					self.props.history.push("/redirect" + window.location.pathname)
				} else {
					if(ret.message == "ACCOUNT_EXISTS"){
						detach.send(PostURLEncoded("")).then(() => {
							self.props.history.push("/redirect" + window.location.pathname)
						})
						return
					}
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					});
				}
			})
		}
	}
	doSubmit(): Promise<any> {
		const self = this;
		this.clearErrors();
		return getProtoPersonCookie.send(PostURLEncoded({})).then(() => savePersonData.send(makePostJSON({
			nameFirst: self.state.formData.purchaserNameFirst,
			nameLast: self.state.formData.purchaserNameLast,
			email: self.state.formData.email,
			doRecurring: self.state.formData.doRecurring.map(r => r == Recurring.RECURRING).getOrElse(false),
		}))).then(ret => {
			if (ret.type == "Success") {
				self.props.goNext();
			} else {
				if(ret.message == "ACCOUNT_EXISTS"){
					self.setState((s) => ({...s,
						hasPersonWarning: true
					}))
				}else{
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					})
				}
			}
		});
		
	}
	render() {
		const self = this
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const donationAmountCell = (<div>
			How much can you give this season?<br />
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
			<FactaButton text="Add Donation" spinnerOnClick onClick={() => this.doAddDonation()}/>
		</div>)

		const fundCell = (<div>
			How would you like your gift to be used?
			<br />
			<FormSelect	
				id="selectedFund"
				label=""
				value={this.state.formData.selectedFund}
				updateAction={updateState}
				options={this.state.availableFunds.map(fund => ({
					key: String(fund.fundId),
					display: fund.fundName
				}))}
				justElement={true}
			/>&nbsp;&nbsp;
			<a href="#" onClick={() => newPopWin('/funds#funds', 1100, 800)} >Click here for a list of gift purposes.</a>
		</div>)

		const inMemoryCell = (<div>
			If you would like to make your gift in honor of<br />or in memory of an individual, type their name below:
			<br />
			<FormInput
				id="inMemory"
				value={this.state.formData.inMemory}
				justElement
				updateAction={updateState}
			/>
		</div>)

		const donationRow = this.state.availableFunds.length > 0 ? (<table style={{width: "100%"}}><tbody><tr>
			<td style={{verticalAlign: "top"}}>{donationAmountCell}</td>
			<td style={{verticalAlign: "top"}}>
				<table><tbody>
					<tr><td>{fundCell}</td></tr>
					<tr><td></td></tr>
					<tr><td>{inMemoryCell}</td></tr>
				</tbody></table>
			</td>
		</tr></tbody></table>) : null;

		const ifStarted = <React.Fragment>
			<FactaArticleRegion title="Donation Summary">
				<FullCartReport
					cartItems={self.props.cartItems}
					history={this.props.history}
					setErrors={() => {}}
					includeCancel={true}
					excludeMemberName={true}
					pageFlavor={PageFlavor.DONATE}
				/>
				<br />
				{ <table><tbody><tr>
					<td>Would you like to repeat this donation monthly? </td>
					<td style={{width: "10%"}}></td>
					<td>
						<FormRadio 
							id="doRecurring"
							value={self.state.formData.doRecurring}
							values={[Recurring.ONCE, Recurring.RECURRING].map(v => ({
								key: v,
								display: v
							}))}
							justElement
							updateAction={updateState}
						/>
					</td>
				</tr></tbody></table>}
			</FactaArticleRegion>
			<StandalonePurchaserInfo authedAsRealPerson={this.props.orderStatus.authedAsRealPerson} state={this.state} updateState={updateState} history={this.props.history} hasPersonWarning={this.state.hasPersonWarning}/>
			<FactaButton text="Next >" spinnerOnClick onClick={this.doSubmit.bind(this)} />
		</React.Fragment>;

		return (
			<FactaMainPage setBGImage={setCheckoutImageForDonations} errors={this.state.validationErrors}>
				<FactaArticleRegion title={<span>Support Community Boating by making a donation today!</span>}>
					{/* <DonationThirdPartyWidget /> */}
					<br />
					Community Boating, Inc. is a private, 501(c)3 non-profit organization operating affordable and accessible programs
					for kids, adults and individuals with special needs under the mission of 'sailing for all.'
					<br />
					<br />
					You can donate to multiple areas if you wish; simply choose a gift purpose, click "Add Donation," and repeat for as many purposes as you like.
				</FactaArticleRegion>
				{donationRow}
				{self.props.cartItems.length > 0 ? ifStarted : null}
			</FactaMainPage>
		)
	}
}