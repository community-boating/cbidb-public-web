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
import Button from "../../components/Button";

export interface Props {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	cardData: CardData
}

export default class PaymentConfirmPage extends React.PureComponent<Props> {
	render() {
		const self = this
		return (<JoomlaMainPage>
			<JoomlaArticleRegion title="Order Summary">
				<JoomlaReport headers={["Item Name", "Member Name", "Price"]} rows={[]}/>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Your Billing Info">
				{JSON.stringify(this.props.cardData)}
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev} />
		</JoomlaMainPage>);
	}
}
