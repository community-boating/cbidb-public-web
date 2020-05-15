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
import { Option, none } from "fp-ts/lib/Option";
import { RadioGroup } from "../../components/InputGroup";
import formUpdateState from "../../util/form-update-state";
import {donationFundValidator} from "../../async/donation-funds"
import { Select } from "../../components/Select";
import newPopWin from "../../util/newPopWin";

export interface Props {
	welcomePackage: t.TypeOf<typeof welcomeJPValidator>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	setCardData: (cardData: CardData) => void,
	cartItems: CartItem[],
	history: History<any>,
	donationFunds: t.TypeOf<typeof donationFundValidator>[]
}

type Form = {
	selectedDonationAmount: Option<string>,
	selectedFund: Option<string>
}

type State = {
	formData: Form
}

class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

export default class PaymentDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = {
			formData: {
				selectedDonationAmount: none,
				selectedFund: none
			}
		}
	}
	componentDidMount() {
		setCheckoutImage()
	}
	render() {
		const self = this;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const fundIsUnused = (fund: t.TypeOf<typeof donationFundValidator>) => {
			return !this.props.cartItems.find(item => item.fundId.getOrElse(null) == fund.fundId)
		}

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
		</div>)

		const fundCell = (<div>
			How would you like your gift to be used?
			<br />
			<FormSelect	
				id="selectedFund"
				label=""
				value={this.state.formData.selectedFund}
				updateAction={updateState}
				options={this.props.donationFunds.filter(fundIsUnused).map(fund => ({
					key: String(fund.fundId),
					display: fund.fundName
				}))}
				justElement={true}
			/>&nbsp;&nbsp;
			<a href="#" onClick={() => newPopWin('/funds#funds', 1100, 800)} >Click here for more information about our funds.</a>
		</div>)

		const donationRow = (<table style={{width: "100%"}}><tbody><tr>
			<td style={{verticalAlign: "top"}}>{donationAmountCell}</td>
			<td style={{verticalAlign: "top"}}>{fundCell}</td>
		</tr></tbody></table>);

		const stripeElement = <StripeElement
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

		const confirm = this.props.orderStatus.cardData.map(cd => <StripeConfirm
			cardData={cd}
		/>);

		const reset = (confirm.isSome()
			? <a href="#" onClick={() => clearCard.send(makePostString("")).then(() => self.props.history.push(`/redirect${checkoutPageRoute.getPathFromArgs({})}`))}>Click here to use a different credit card.</a>
			: "Please enter payment information below. Credit card information is not stored by CBI and is communicated securely to our payment processor."
		);

		return <JoomlaMainPage setBGImage={setCheckoutImage}>
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
			<table><tbody><tr>
				<td style={{ width: "100%" }}>
					<JoomlaArticleRegion title="Order Summary">
						<FullCartReport cartItems={self.props.cartItems} />
					</JoomlaArticleRegion>
				</td>
				<td>
					{/* <JoomlaArticleRegion title="Promotional Code">
					</JoomlaArticleRegion>
					<JoomlaArticleRegion title="Gift Certificate">
					</JoomlaArticleRegion> */}
				</td>
			</tr></tbody></table>
			<JoomlaArticleRegion title="Credit Card Payment">
				{reset}
				<br />
				<br />
				{confirm.getOrElse(stripeElement)}
			</JoomlaArticleRegion>
			{confirm.isSome() ? <Button text="Continue >" onClick={this.props.goNext} /> : ""}

		</JoomlaMainPage>
	}
}
