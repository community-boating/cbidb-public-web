import * as React from "react";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../../theme/joomla/JoomlaReport";
import { CardData } from "./CheckoutWizard";
import Button from "../../components/Button";
import StripeConfirm from "../../components/StripeConfirm";

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
				<StripeConfirm cardData={this.props.cardData} />
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev} />
		</JoomlaMainPage>);
	}
}
