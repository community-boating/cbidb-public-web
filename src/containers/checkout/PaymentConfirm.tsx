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
		return (<JoomlaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<JoomlaArticleRegion title="Order Summary">
				Please confirm your order and payment information are correct, and then click "Submit Payment" below!
				<br />
				<br />
				<FullCartReport cartItems={self.props.cartItems} history={this.props.history} setErrors={() => {}}/>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Your Billing Info">
				<StripeConfirm cardData={this.props.orderStatus.cardData.getOrElse(null)} />
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={this.props.goPrev} />
			<Button text="Submit Payment" spinnerOnClick onClick={() => {
				self.setState({
					...self.state,
					validationErrors: []
				});
				return submitPayment.send(makePostString("")).then(res => {
					if (res.type == "Failure" && res.code == "process_err") {
						self.setState({
							...self.state,
							validationErrors: [res.message]
						});
					} else {
						// TODO: catch any bullcrap error after payment process
						self.props.goNext()
					}
				})
			}} />
		</JoomlaMainPage>);
	}
}
