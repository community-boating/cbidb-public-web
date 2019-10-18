import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../../theme/joomla/JoomlaReport";
import StripeElement from "../../components/StripeElement";

export interface Props {

}

export default class PaymentDetailsPage extends React.PureComponent<Props> {
	render() {

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
				Please enter payment information below. Credit card information is not stored by CBI and is communicated securely to our servers using SSL.
				<StripeElement
					formId="payment-form"
					elementId="card-element"
					cardErrorsId="card-errors"
				 />
			</JoomlaArticleRegion>
			
		</JoomlaMainPage>
	}
}
