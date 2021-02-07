import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import Button from "../../components/Button";
import StripeConfirm from "../../components/StripeConfirm";
import {orderStatusValidator} from "../../async/order-status"
import { postWrapper as submitPaymentAP } from "../../async/stripe/submit-payment-ap"
import { postWrapper as submitPaymentJP } from "../../async/stripe/submit-payment-jp"
import { makePostString } from "../../core/APIWrapperUtil";
import ErrorDiv from "../../theme/joomla/ErrorDiv";
import { History } from "history";
import { setCheckoutImage } from "../../util/set-bg-image";
import FullCartReport from "../../components/FullCartReport";
import { CartItem } from "../../async/get-cart-items";
import Currency from "../../util/Currency";
import { PageFlavor } from "../../components/Page";

export interface Props {
	history: History<any>,
	cartItems: CartItem[],
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
	flavor: PageFlavor
}

type State = {
	validationErrors: string[]
}

export default class PaymentConfirmPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: []
		};
	}
	getSubmitPayment = function() {
		switch(this.props.flavor){
			case PageFlavor.AP:
				return submitPaymentAP;
			case PageFlavor.JP:
				return submitPaymentJP;
		}
	}
	componentDidMount() {
		setCheckoutImage()
	}
	render() {
		const self = this
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);
		const orderTotal = this.props.cartItems.reduce((sum, i) => sum + i.price, 0)

		const billingInfo = (
			orderTotal <= 0
			? "Your order is fully paid for; click \"Finish Order\" below to finalize the order."
			: (<React.Fragment>
				<StripeConfirm cardData={this.props.orderStatus.cardData.getOrElse(null)} />
			</React.Fragment>)
		);

		const buttonText = (
			orderTotal <= 0
			? "Finish Order"
			: "Submit Payment"
		);

		return (<JoomlaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<JoomlaArticleRegion title="Order Summary">
				Please confirm your order and payment information are correct, and then click "Submit Payment" below!
				<br />
				<br />
				<FullCartReport
					cartItems={self.props.cartItems}
					history={this.props.history}
					setErrors={() => {}}
					includeCancel={false}
					extraFooterRow={(
						this.props.orderStatus.staggeredPayments.length
						? [
							"<b>Charged Today</b>",
							"",
							<b>{Currency.cents(this.props.orderStatus.staggeredPayments[0].paymentAmtCents).format()}</b>
						]
						: []
					)}
					pageFlavor={this.props.flavor}
				/>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Your Billing Info">
				{billingInfo}
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev} />
			<Button text={buttonText} spinnerOnClick onClick={() => {
				self.setState({
					...self.state,
					validationErrors: []
				});
				return self.getSubmitPayment().send(makePostString("")).then(res => {
					if (res.type == "Failure" ) {
						if (res.code == "process_err") {
							self.setState({
								...self.state,
								validationErrors: [res.message]
							});
						} else {
							self.setState({
								...self.state,
								validationErrors: ["An error occurred.  Tech support has been notified; do not resubmit payment.  If this problem persists contact the Front Office at 617-523-1038"]
							});
						}
					} else {
						// TODO: catch any bullcrap error after payment process
						self.props.goNext()
					}
				})
			}} />
		</JoomlaMainPage>);
	}
}
