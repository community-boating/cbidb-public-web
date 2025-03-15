import * as React from "react";
import * as t from 'io-ts';
import FactaMainPage from "theme/facta/FactaMainPage";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { TokensResult } from "models/stripe/tokens";
import {PaymentMethod} from "models/stripe/PaymentMethod"
import { postWrapper as storeToken } from "async/stripe/store-token"
import { makePostJSON, PostURLEncoded } from "core/APIWrapperUtil";
import { orderStatusValidator, CardData } from "async/order-status"
import FactaButton from "theme/facta/FactaButton";
import { History } from "history";
import { setCheckoutImage } from "util/set-bg-image";
import { CartItem } from "async/get-cart-items"
import FullCartReport from "components/FullCartReport";
import { checkoutPageRoute as apCheckoutRoute} from "app/routes/checkout-ap";
import { checkoutPageRoute as jpCheckoutRoute} from "app/routes/checkout-jp";
import { validator as welcomeJPValidator } from "async/member-welcome-jp";
import { Option, none, some } from "fp-ts/lib/Option";
import { RadioGroup } from "components/InputGroup";
import formUpdateState from "util/form-update-state";
import {donationFundValidator} from "async/donation-funds"
import { Select } from "components/Select";
import newPopWin from "util/newPopWin";
import TextInput from "components/TextInput";
import {FactaErrorDiv} from "theme/facta/FactaErrorDiv";
import { left, right, Either } from "fp-ts/lib/Either";
import {postWrapper as addDonation} from "async/member/add-donation"
import {postWrapper as addPromo} from "async/member/add-promo-code"
import {postWrapper as applyGC} from "async/member/apply-gc"
import {postWrapper as createCompassOrderAPIAP} from "async/ap/create-compass-order"
import {postWrapper as createCompassOrderAPIJP} from "async/junior/create-compass-order"
import { StaggeredPaymentSchedule } from "components/StaggeredPaymentSchedule";
import Currency from "util/Currency";
import { apRegPageRoute } from "app/routes/ap/reg";
import { Link } from "react-router-dom";
import { PageFlavor } from "components/Page";
import StandardReport from "theme/facta/StandardReport";
import {postWrapper as setJPStaggered} from "async/member/set-payment-plan-jp"
import fundsPath from "app/paths/common/funds"

type DonationFund = t.TypeOf<typeof donationFundValidator>;

export interface Props {
	welcomePackage: t.TypeOf<typeof welcomeJPValidator>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	setCardData: (cardData: CardData) => void,
	cartItems: CartItem[],
	history: History<any>,
	donationFunds: DonationFund[],
	flavor: PageFlavor
}

type Form = {
	selectedDonationAmount: Option<string>,
	selectedFund: Option<string>,
	otherAmount: Option<string>,
	promoCode: Option<string>,
	gcNumber: Option<string>,
	gcCode: Option<string>,
}

type State = {
	availableFunds: DonationFund[],
	formData: Form,
	validationErrors: string[],
	jpDoStaggeredPayment: Option<string>,
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
				gcCode: none,
			},
			jpDoStaggeredPayment: some("N"),//this.props.orderStatus.staggeredPayments.length > 0 ? some("Y") : some("N"),
			validationErrors: [],
		}
	}
	tableRef: HTMLTableElement
	getCheckoutPageRoute = function() {
		switch (this.props.flavor) {
		case PageFlavor.AP:
			return apCheckoutRoute;
		case PageFlavor.JP:
			return jpCheckoutRoute;
		}
	}
	getCreateCompassOrderAPI() {
		switch (this.props.flavor) {
			case PageFlavor.AP:
				return createCompassOrderAPIAP;
			case PageFlavor.JP:
				return createCompassOrderAPIJP;
			}
	}
	componentDidMount() {
		setCheckoutImage()
		if (window.location.hash) this.tableRef.focus();
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
			return addDonation.send(makePostJSON({
				fundId: this.state.formData.selectedFund.map(Number).getOrElse(null),
				amount: errorOrOtherAmt.getOrElse(null),
				program: this.props.flavor
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
			<div style={{margin: "20px 0"}}><FactaButton text="Add Donation" onClick={() => this.doAddDonation()}/></div>
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
			<a href="#" onClick={() => newPopWin(fundsPath.getPathFromArgs({}), 1100, 800)} >Click here for a list of gift purposes.</a>
		</div>)

		const donationRow = this.state.availableFunds.length > 0 ? (<table style={{width: "100%"}}><tbody><tr>
			<td style={{verticalAlign: "top"}}>{donationAmountCell}</td>
			<td style={{verticalAlign: "top"}}>{fundCell}</td>
		</tr></tbody></table>) : null;

		const processToken = (result: TokensResult) => {
			return storeToken.send(makePostJSON({
				token: result.token.id,
				orderId: self.props.welcomePackage.orderId
			})).then(result => {
				if (result.type == "Success") {
					self.props.setCardData(result.success);
					self.props.goNext();
				} else {
					self.setState({
						...self.state,
						validationErrors: [result.message]
					});
					window.scrollTo(0, 0);
				}
			})
		}

		const orderTotalIsZero = this.props.cartItems.reduce((sum, i) => sum + i.price, 0) <= 0;

		//const confirm = this.props.orderStatus.

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const setErrors = (errors: string) => {
			window.scrollTo(0, 0);
			self.setState({
				...self.state,
				validationErrors: errors.split("\\n") // TODO
			});
		}

		const gcRegion = (<FactaArticleRegion title="Gift Certificate">
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
			<FactaButton text="Apply" spinnerOnClick onClick={() => {
				return applyGC.send(makePostJSON({ 
					gcNumber: Number(this.state.formData.gcNumber.getOrElse(null)),
					gcCode: this.state.formData.gcCode.getOrElse(null),
					program: this.props.flavor
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
		</FactaArticleRegion>);

		const noGCRegion = (<FactaArticleRegion title="Gift Certificate">
			Gift certificates currently cannot be used with staggered payment memberships.
			To redeem a Gift Certificate, {this.props.flavor == "AP" ? <React.Fragment><Link to={apRegPageRoute.getPathFromArgs({})}>return to registration</Link> and</React.Fragment>: ""} select a one-time payment.
		</FactaArticleRegion>);

		const scheduleRadio = (id: string, group: string, doStaggered: boolean, text: JSX.Element) => {
			const onClick = (doStaggered: boolean) => {
				self.setState({
					...self.state,
					jpDoStaggeredPayment: doStaggered ? some("Y") : some("N")
				})
				setJPStaggered.send(makePostJSON({doStaggeredPayments: doStaggered})).then(() => self.props.history.push("/redirect" + window.location.pathname + "#jp-payment-mode"))
			}
			const currentlyDoingStaggered = this.state.jpDoStaggeredPayment.getOrElse(null) == "Y"

			const checked = (
				doStaggered
				? currentlyDoingStaggered
				: !currentlyDoingStaggered
			);

			const refObj = (
				doStaggered
				? {}
				: { ref: (e: any) => this.tableRef = e}
			)

			return (<React.Fragment>
				<table><tbody><tr>
					<td><input type="radio" id={id} {...refObj} checked={checked} onChange={() => onClick(doStaggered)} value={doStaggered ? "Y" : "N"}></input></td>	
					<td><label htmlFor={id}>{text}</label></td>
				</tr></tbody></table>
			</React.Fragment>);
		}

		const singlePaymentTable = (total: Currency) => <StandardReport
			headers={["Date", "Amount"]}
			cellStyles={[{textAlign: "right"}, {textAlign: "right"}]}
			rows={[[
				<span>Single Charge</span>,
				total.format()
			], [
				<b>Total</b>,
				<b>{total.format()}</b>
			]]}
		/>

		const staggeredCellStyle = (selected: boolean) => ({
			verticalAlign: "top",
			padding: "8px",
			border: selected ? "2px solid #2358A6" : undefined
		})

		return <FactaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<FactaArticleRegion title="Please consider making a donation to Community Boating.">
				{`Community Boating, Inc. (CBI) is a 501(c)3 non-profit organization operating affordable and accessible programs
				for kids, adults and individuals with special needs under the mission of 'sailing for all.'
				Our commitment to keeping membership fees affordable means that membership fees by themselves do not cover all of CBI's operating costs.
				Please help us keep "Sailing for All" on the Charles River by making a tax deductible donation. Your support is greatly appreciated!`}
				<br />
				<br />
				You can donate to multiple areas if you wish; simply choose a gift purpose, click "Add Donation," and repeat for as many purposes as you like.
			</FactaArticleRegion>
			{donationRow}
			<table><tbody><tr style={{verticalAlign: "top"}}>
				<td style={{ width: "100%" }}>
					<FactaArticleRegion title="Order Summary">
						<FullCartReport
							cartItems={self.props.cartItems}
							history={this.props.history}
							setErrors={setErrors}
							includeCancel={true}
							pageFlavor={this.props.flavor}
						/>
					</FactaArticleRegion>
					{(
						this.props.flavor == PageFlavor.AP && this.props.orderStatus.staggeredPayments.length
						? (<FactaArticleRegion title="Payment Schedule">
							Today your card will be charged <b>{Currency.cents(this.props.orderStatus.staggeredPayments[0].paymentAmtCents).format()}</b>. Your
							card will be charged again on the following dates to complete your order:
							<br /><br />
							<StaggeredPaymentSchedule schedule={this.props.orderStatus.staggeredPayments}/>
						</FactaArticleRegion>)
						: null
					)}
					{(
						this.props.flavor == PageFlavor.JP && this.props.orderStatus.jpAvailablePaymentSchedule.length
						? (<FactaArticleRegion title="Payment Schedule">
							Staggered payment is available.  You may pay fully today, or spread the cost of your order between now and the start of Junior Program.
							<br /><br />
							<table><tbody><tr>
								<td style={staggeredCellStyle(this.state.jpDoStaggeredPayment.getOrElse(null) != "Y")}>
									{scheduleRadio(
										"radio-single-payment", 
										"schedule-select",
										false,
										<React.Fragment>Select to pay fully today,<br />in one payment</React.Fragment>
									)}
									<br /><br />
									{singlePaymentTable(Currency.dollars(this.props.orderStatus.total))}
								</td>
								<td style={staggeredCellStyle(this.state.jpDoStaggeredPayment.getOrElse(null) == "Y")}>
									{scheduleRadio(
										"radio-staggered-payment",
										"schedule-select",
										true,
										<React.Fragment>Select to pay<br />in the following installments</React.Fragment>
									)}
									<br /><br />
									<StaggeredPaymentSchedule schedule={this.props.orderStatus.jpAvailablePaymentSchedule}/>
								</td>
							</tr></tbody></table>
						</FactaArticleRegion>)
						: null
					)}
				</td>
				<td>
					<FactaArticleRegion title="Promotional Code">
						Enter promotional code:
						<FormInput
							id="promoCode"
							value={this.state.formData.promoCode}
							justElement={true}
							updateAction={updateState}
							size={30}
							maxLength={30}
						/>
						<FactaButton text="Apply" spinnerOnClick onClick={() => {
							return addPromo.send(makePostJSON({
								promoCode: this.state.formData.promoCode.getOrElse(null),
								program: this.props.flavor
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
					</FactaArticleRegion>
				</td>
			</tr></tbody></table>

			<FactaButton text="Create Compass Order" spinnerOnClick onClick={() => this.getCreateCompassOrderAPI().send(PostURLEncoded({}))}/>

		</FactaMainPage>
	}
}
