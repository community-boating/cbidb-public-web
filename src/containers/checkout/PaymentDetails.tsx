import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../../theme/joomla/JoomlaReport";
import StripeElement from "../../components/StripeElement";
import { TokensResult } from "../../models/stripe/tokens";
import { postWrapper as storeToken } from "../../async/stripe/store-token"
import { PostJSON } from "../../core/APIWrapper";
import { Form as HomePageForm } from "../HomePage";
import { CardData } from "./CheckoutWizard";

export interface Props {
	welcomePackage: HomePageForm,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	setCardData: (cardData: CardData) => void
}

export default class PaymentDetailsPage extends React.PureComponent<Props> {
	render() {
		const self = this
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
						<JoomlaReport headers={["Item Name", "Member Name", "Price"]} rows={[]}/>
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
				Please enter payment information below. Credit card information is not stored by CBI and is communicated securely to our payment processor.
				<br />
				<br />
				<StripeElement
					formId="payment-form"
					elementId="card-element"
					cardErrorsId="card-errors"
					then={(result: TokensResult) => {
						console.log(result)
						storeToken.send(PostJSON({
							token: result.token.id,
							orderId: self.props.welcomePackage.orderId
						})).then(result => {
							if (result.type == "Success") {
								self.props.setCardData({
									cardLast4: result.success.last4,
									cardExpMonth: result.success.expMonth,
									cardExpYear: result.success.expYear,
									cardZip: result.success.zip
								});
								self.props.goNext();
							}
							
						})
					}}
				 />
			</JoomlaArticleRegion>
			
		</JoomlaMainPage>
	}
}
