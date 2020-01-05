import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import StripeElement from "../../components/StripeElement";
import { TokensResult } from "../../models/stripe/tokens";
import { postWrapper as storeToken } from "../../async/stripe/store-token"
import { PostJSON, PostString } from "../../core/APIWrapper";
import { Form as HomePageForm } from "../HomePage";
import { orderStatusValidator, CardData } from "../../async/order-status"
import StripeConfirm from "../../components/StripeConfirm";
import Button from "../../components/Button";
import { postWrapper as clearCard } from '../../async/stripe/clear-card'
import { History } from "history";
import { setCheckoutImage } from "../../util/set-bg-image";
import { CartItem } from "../../async/get-cart-items"
import FullCartReport from "../../components/FullCartReport";

export interface Props {
	welcomePackage: HomePageForm,
	orderStatus: t.TypeOf<typeof orderStatusValidator>
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	setCardData: (cardData: CardData) => void,
	cartItems: CartItem[],
	history: History<any>
}

export default class PaymentDetailsPage extends React.PureComponent<Props> {
	componentDidMount() {
		setCheckoutImage()
	}
	render() {
		const self = this

		const stripeElement = <StripeElement
			formId="payment-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: TokensResult) => {
				storeToken.send(PostJSON({
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
			? <a href="#" onClick={() => clearCard.send(PostString("")).then(() => self.props.history.push('/redirect/checkout'))}>Click here to use a different credit card.</a>
			: "Please enter payment information below. Credit card information is not stored by CBI and is communicated securely to our payment processor."
		);

		return <JoomlaMainPage>
			{/* <JoomlaArticleRegion title="Please consider making a donation to Community Boating.">
				{`Community Boating, Inc. (CBI) is a 501(c)3 non-profit organization operating affordable and accessible programs
				for kids, adults and individuals with special needs under the mission of 'sailing for all.'
				Our commitment to keeping membership fees affordable means that membership fees by themselves do not cover all of CBI's operating costs.
				Please help us keep "Sailing for All" on the Charles River by making a tax deductible donation. Your support is greatly appreciated!`}
				<br />
				<br />
				You can donate to multiple areas if you wish; simply choose a fund, click "Add Donation," and repeat for as many funds as you like.
			</JoomlaArticleRegion> */}
			<table><tbody><tr>
				<td style={{width: "100%"}}>
					<JoomlaArticleRegion title="Order Summary">
						<FullCartReport cartItems={self.props.cartItems}/>
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
