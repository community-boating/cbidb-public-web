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
import ErrorDiv from "../../theme/joomla/ErrorDiv";
import { History } from "history";

export interface Props {
	history: History<any>,
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
	render() {
		const self = this
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);
		return (<JoomlaMainPage>
			{errorPopup}
			<JoomlaArticleRegion title="Order Summary">
				<JoomlaReport headers={["Item Name", "Member Name", "Price"]} rows={[]}/>
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
				return submitPayment.send(PostString("")).then(res => {
					console.log(res)
					if (res.type == "Failure" && res.code == "process_err") {
						self.setState({
							...self.state,
							validationErrors: [res.message]
						});
					} else {
						// TODO: catch any bullcrap error after payment process
						self.props.history.push("/")
					}
				})
			}} />
		</JoomlaMainPage>);
	}
}
