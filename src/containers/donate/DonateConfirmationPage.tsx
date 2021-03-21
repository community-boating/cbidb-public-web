import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
import { CartItem } from '../../async/get-cart-items';
import FullCartReport from '../../components/FullCartReport';
import { PageFlavor } from '../../components/Page';
import { orderStatusValidator } from "../../async/order-status"
import { postWrapper as submitPayment } from "../../async/stripe/submit-payment-standalone"
import { makePostJSON, makePostString } from '../../core/APIWrapperUtil';
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import StripeConfirm from '../../components/StripeConfirm';
import { postWrapper as clearCard } from '../../async/stripe/clear-card'
import StripeElement from '../../components/StripeElement';
import { postWrapper as storeToken } from "../../async/stripe/store-token"
import { TokensResult } from '../../models/stripe/tokens';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	reload: () => void,
	cartItems: CartItem[],
	history: History<any>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

type State = {
	validationErrors: string[]
}

export default class DonateConfirmationPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			validationErrors: []
		};
	}
	render() {
		const self = this;

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const confirm = this.props.orderStatus.cardData.map(cd => <React.Fragment>
			<StripeConfirm
				cardData={cd}
			/>
			<Button text="< Back" onClick={this.props.goPrev}/>
			<Button text="Submit Donation" spinnerOnClick onClick={() => {
				self.setState({
					...self.state,
					validationErrors: []
				});
				return submitPayment.send(makePostString("program=" + PageFlavor.DONATE)).then(res => {
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
			}}/>
		</React.Fragment>);

		const paymentTextOrResetLink = (function(){
			if (confirm.isSome()) {
				return <Button plainLink text="Click here to use a different credit card." onClick={e => {
					e.preventDefault();
					return clearCard.send(makePostJSON({program: PageFlavor.DONATE}))
						.then(() => self.props.reload());
				}} />
			} else {
				return "Please enter payment information below. Credit card information is communicated securely to our payment processor and will not be stored by CBI for this order.";
			}
		}());

		const processToken = (result: TokensResult) => {
			return storeToken.send(makePostJSON({
				token: result.token.id,
				orderId: self.props.orderStatus.orderId
			})).then(result => {
				if (result.type == "Success") {
					self.props.reload();
				} else {
					self.setState({
						...self.state,
						validationErrors: [result.message]
					});
					window.scrollTo(0, 0);
				}
			})
		}

		const stripeElement = <StripeElement
			submitMethod={
				self.props.orderStatus.paymentMethodRequired
				? "PAYMENT_METHOD"
				: "TOKEN"
			}
			formId="payment-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={processToken}
			additionalButtons={<Button text="< Back" onClick={this.props.goPrev}/>}
		/>;

		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				{errorPopup}
				<JoomlaArticleRegion title={"Donation Summary"}>
					<FullCartReport
						cartItems={this.props.cartItems}
						history={this.props.history}
						setErrors={() => {}}
						includeCancel={false}
						excludeMemberName={true}
						pageFlavor={PageFlavor.DONATE}
					/>
					<br />
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title={"Your Billing Info"}>
					{paymentTextOrResetLink}
					<br />
					<br />
					{confirm.getOrElse(stripeElement)}
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}