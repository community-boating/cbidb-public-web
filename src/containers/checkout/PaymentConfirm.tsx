import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaReport from "../../theme/joomla/JoomlaReport";
import Button from "../../components/Button";
import StripeConfirm from "../../components/StripeConfirm";
import {orderStatusValidator, CardData} from "../../async/order-status"
import { postWrapper as submitPayment } from "../../async/stripe/submit-payment"
import { PostString } from "../../core/APIWrapper";

export interface Props {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>
}

export default class PaymentConfirmPage extends React.PureComponent<Props> {
	render() {
		const self = this
		console.log("##$#$#$#$#", this.props.orderStatus)
		return (<JoomlaMainPage>
			<JoomlaArticleRegion title="Order Summary">
				<JoomlaReport headers={["Item Name", "Member Name", "Price"]} rows={[]}/>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Your Billing Info">
				<StripeConfirm cardData={this.props.orderStatus.cardData.getOrElse(null)} />
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev} />
			<Button text="Submit Payment" onClick={() => submitPayment.send(PostString(""))} />
		</JoomlaMainPage>);
	}
}
