import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import StripeElement from "../../components/StripeElement";
import { TokensResult } from "../../models/stripe/tokens";
import { postWrapper as storeToken } from "../../async/stripe/store-token"
import { makePostJSON, makePostString } from "../../core/APIWrapperUtil";
import { orderStatusValidator, CardData } from "../../async/order-status"
import StripeConfirm from "../../components/StripeConfirm";
import Button from "../../components/Button";
import { postWrapper as clearCard } from '../../async/stripe/clear-card'
import { History } from "history";
import { setCheckoutImage } from "../../util/set-bg-image";
import { CartItem } from "../../async/get-cart-items"
import FullCartReport from "../../components/FullCartReport";
import { checkoutPageRoute } from "../../app/routes/common/checkout";
import { validator as welcomeJPValidator } from "../../async/member-welcome-jp";
import { Option, none, some } from "fp-ts/lib/Option";
import { RadioGroup } from "../../components/InputGroup";
import formUpdateState from "../../util/form-update-state";
import {donationFundValidator} from "../../async/donation-funds"
import { Select } from "../../components/Select";
import newPopWin from "../../util/newPopWin";
import TextInput from "../../components/TextInput";
import ErrorDiv from "../../theme/joomla/ErrorDiv";
import { left, right, Either } from "fp-ts/lib/Either";
import {postWrapper as addDonation} from "../../async/member/add-donation"
import {postWrapper as addPromo} from "../../async/member/add-promo-code"
import {postWrapper as applyGC} from "../../async/member/apply-gc"

type DonationFund = t.TypeOf<typeof donationFundValidator>;

export interface Props {
	welcomePackage: t.TypeOf<typeof welcomeJPValidator>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	setCardData: (cardData: CardData) => void,
	cartItems: CartItem[],
	history: History<any>,
	donationFunds: DonationFund[]
}

type Form = {
	selectedDonationAmount: Option<string>,
	selectedFund: Option<string>,
	otherAmount: Option<string>,
	promoCode: Option<string>,
	gcNumber: Option<string>,
	gcCode: Option<string>
}

type State = {
	availableFunds: DonationFund[],
	formData: Form,
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

export default class PaymentDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const fundIsUnused = (fund: t.TypeOf<typeof donationFundValidator>) => {
			return !this.props.cartItems.find(item => item.fundId.getOrElse(null) == fund.fundId)
		}

		const availableFunds = this.props.donationFunds.filter(fundIsUnused)

		this.state = {
			availableFunds,
			formData: {
				selectedDonationAmount: none,
				selectedFund: availableFunds.length > 0 ? some(String(availableFunds[0].fundId)) : none,
				otherAmount: none,
				promoCode: none,
				gcNumber: none,
				gcCode: none
			},
			validationErrors: []
		}
	}
	componentDidMount() {
		setCheckoutImage()
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
		console.log(this.state.formData)
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
			console.log("looks ok ", errorOrOtherAmt.getOrElse(null))
			return addDonation.send(makePostJSON({fundId: this.state.formData.selectedFund.map(Number).getOrElse(null), amount: errorOrOtherAmt.getOrElse(null)}))
			.then(ret => {
				if (ret.type == "Success") {
					self.props.history.push("/redirect" + window.location.pathname)
				} else {
					window.scrollTo(0, 0);
					self.setState({
						...self.state,
						validationErrors: ret.message.split("\\n") // TODO
					});
				}
			})
		}
	}
	render() {
		const self = this;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");



		const donationAmountCell = (<div>
			How much can you give this season?<br />
			<FormRadio
				id="selectedDonationAmount"
				justElement={true}
				columns={3}
				values={[{
					key: "None",
					display: "None"
				}, {
					key: "10",
					display: "$10"
				}, {
					key: "20",
					display: "$20"
				}, {
					key: "50",
					display: "$50"
				}, {
					key: "75",
					display: "$75"
				}, {
					key: "100",
					display: "$100"
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
				<FormInput
					id="otherAmount"
					label="$"
					value={this.state.formData.otherAmount}
					updateAction={updateState}
					size={10}
					maxLength={10}
				/>
				: null
			}
			<Button text="Add Donation" onClick={() => this.doAddDonation()}/>
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
			<a href="#" onClick={() => newPopWin('/funds#funds', 1100, 800)} >Click here for more information about our funds.</a>
		</div>)

		const donationRow = this.state.availableFunds.length > 0 ? (<table style={{width: "100%"}}><tbody><tr>
			<td style={{verticalAlign: "top"}}>{donationAmountCell}</td>
			<td style={{verticalAlign: "top"}}>{fundCell}</td>
		</tr></tbody></table>) : null;

		const stripeElement = <StripeElement
			submitMethod="TOKEN"
			formId="payment-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: TokensResult) => {
				storeToken.send(makePostJSON({
					token: result.token.id,
					orderId: self.props.welcomePackage.orderId
				})).then(result => {
					if (result.type == "Success") {
						self.props.setCardData(result.success);
						self.props.goNext();
					}
				})
			}}
		/>;

		const orderTotalIsZero = this.props.cartItems.reduce((sum, i) => sum + i.price, 0) <= 0;

		const confirm = this.props.orderStatus.cardData.map(cd => <StripeConfirm
			cardData={cd}
		/>);

		const paymentTextOrResetLink = (function(){
			if (orderTotalIsZero) {
				return "All items are fully paid for; click \"Continue\" to finalize your order.";
			} else {
				if (confirm.isSome()) {
					return <a href="#" onClick={() => clearCard.send(makePostString("")).then(() => self.props.history.push(`/redirect${checkoutPageRoute.getPathFromArgs({})}`))}>Click here to use a different credit card.</a>
				} else {
					return "Please enter payment information below. Credit card information is not stored by CBI and is communicated securely to our payment processor.";
				}
			}
			
		}());

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const setErrors = (errors: string) => {
			window.scrollTo(0, 0);
			self.setState({
				...self.state,
				validationErrors: errors.split("\\n") // TODO
			});
		}

		return <JoomlaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<JoomlaArticleRegion title="Please consider making a donation to Community Boating.">
				{`Community Boating, Inc. (CBI) is a 501(c)3 non-profit organization operating affordable and accessible programs
				for kids, adults and individuals with special needs under the mission of 'sailing for all.'
				Our commitment to keeping membership fees affordable means that membership fees by themselves do not cover all of CBI's operating costs.
				Please help us keep "Sailing for All" on the Charles River by making a tax deductible donation. Your support is greatly appreciated!`}
				<br />
				<br />
				You can donate to multiple areas if you wish; simply choose a fund, click "Add Donation," and repeat for as many funds as you like.
			</JoomlaArticleRegion>
			{donationRow}
			<table><tbody><tr style={{verticalAlign: "top"}}>
				<td style={{ width: "100%" }}>
					<JoomlaArticleRegion title="Order Summary">
						<FullCartReport
							cartItems={self.props.cartItems}
							history={this.props.history}
							setErrors={setErrors}
							includeCancel={true}
						/>
					</JoomlaArticleRegion>
				</td>
				<td>
					<JoomlaArticleRegion title="Promotional Code">
						Enter promotional code:
						<FormInput
							id="promoCode"
							value={this.state.formData.promoCode}
							justElement={true}
							updateAction={updateState}
							size={30}
							maxLength={30}
						/>
						<Button text="Apply" onClick={() => {
							return addPromo.send(makePostJSON({ promoCode: this.state.formData.promoCode.getOrElse(null)}))
							.then(ret => {
								if (ret.type == "Success") {
									self.props.history.push("/redirect" + window.location.pathname)
								} else {
									window.scrollTo(0, 0);
									self.setState({
										...self.state,
										validationErrors: ret.message.split("\\n") // TODO
									});
								}
							})
						}}/>
					</JoomlaArticleRegion>
					<JoomlaArticleRegion title="Gift Certificate">
						Enter Certificate Number<br />
						(e.g. "1380300")
						<FormInput
							id="gcNumber"
							value={this.state.formData.gcNumber}
							justElement={true}
							updateAction={updateState}
							size={30}
							maxLength={30}
						/>
						Enter Redemption Code<br />
						(e.g. "F5BY8")
						<FormInput
							id="gcCode"
							value={this.state.formData.gcCode}
							justElement={true}
							updateAction={updateState}
							size={30}
							maxLength={30}
						/>
						<Button text="Apply" onClick={() => {
							return applyGC.send(makePostJSON({ 
								gcNumber: Number(this.state.formData.gcNumber.getOrElse(null)),
								gcCode: this.state.formData.gcCode.getOrElse(null)
							}))
							.then(ret => {
								if (ret.type == "Success") {
									self.props.history.push("/redirect" + window.location.pathname)
								} else {
									window.scrollTo(0, 0);
									self.setState({
										...self.state,
										validationErrors: ret.message.split("\\n") // TODO
									});
								}
							})
						}}/>
					</JoomlaArticleRegion>
				</td>
			</tr></tbody></table>
			<JoomlaArticleRegion title="Credit Card Payment">
				{paymentTextOrResetLink}
				{orderTotalIsZero ? null : <React.Fragment>
					<br />
				<br />
				{confirm.getOrElse(stripeElement)}
				</React.Fragment>}
			</JoomlaArticleRegion>
			{(confirm.isSome() || orderTotalIsZero )? <Button text="Continue >" onClick={this.props.goNext} /> : ""}

		</JoomlaMainPage>
	}
}
