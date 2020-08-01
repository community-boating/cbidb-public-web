import * as React from "react";
import * as t from 'io-ts';
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import Button from "../../components/Button";
import StripeConfirm from "../../components/StripeConfirm";
import {orderStatusValidator} from "../../async/order-status"
import { postWrapper as submitPayment } from "../../async/stripe/submit-payment"
import { makePostString } from "../../core/APIWrapperUtil";
import ErrorDiv from "../../theme/joomla/ErrorDiv";
import { History } from "history";
import { setCheckoutImage } from "../../util/set-bg-image";
import FullCartReport from "../../components/FullCartReport";
import { CartItem } from "../../async/get-cart-items";

export interface Props {
	history: History<any>,
	cartItems: CartItem[],
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>
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
			: <StripeConfirm cardData={this.props.orderStatus.cardData.getOrElse(null)} />
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
				<FullCartReport cartItems={self.props.cartItems} history={this.props.history} setErrors={() => {}} includeCancel={false}/>
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
				return submitPayment.send(makePostString("")).then(res => {
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
