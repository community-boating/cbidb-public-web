import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import {  setCheckoutImageForDonations } from 'util/set-bg-image';
import { CartItem } from 'async/get-cart-items';
import FullCartReport from 'components/FullCartReport';
import { PageFlavor } from 'components/Page';
import { orderStatusValidator } from "async/order-status"
import { postWrapper as submitPayment } from "async/stripe/submit-payment-standalone"
import { makePostJSON, makePostString } from 'core/APIWrapperUtil';
import StripeConfirm from 'components/StripeConfirm';
import { postWrapper as clearCard } from 'async/stripe/clear-card'
import StripeElement from 'components/StripeElement';
import { postWrapper as storeToken } from "async/stripe/store-token"
import { TokensResult } from 'models/stripe/tokens';
import PlainButton from 'components/PlainButton';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import FactaButton from 'theme/facta/FactaButton';
import { PaymentMethod } from 'models/stripe/PaymentMethod';
import {postWrapper as storePaymentMethod} from "async/stripe/store-payment-method-donate"
import SquarePaymentForm from 'components/SquarePaymentForm';

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
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const confirm = this.props.orderStatus.cardData.map(cd => <React.Fragment>
			<StripeConfirm
				cardData={cd}
			/>
			<br />
			<FactaButton text="< Back" onClick={this.props.goPrev}/>
			<FactaButton text="Submit Donation" spinnerOnClick onClick={() => {
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
				return <PlainButton text="Click here to use a different credit card." onClick={e => {
					e.preventDefault();
					return clearCard.send(makePostJSON({program: PageFlavor.DONATE}))
						.then(() => self.props.reload());
				}} />
			} else {
				return "Please enter payment information below. Credit card information is communicated securely to our payment processor and is not stored by CBI.";
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

		const processPaymentMethod = (result: PaymentMethod) => {
			return storePaymentMethod.send(makePostJSON({
				paymentMethodId: result.paymentMethod.id,
				retryLatePayments: false
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

		const paymentElement = <SquarePaymentForm orderAppAlias='Donate' handleSuccess={() => {
			this.props.goNext()
		}}/>

		return (
			<FactaMainPage setBGImage={setCheckoutImageForDonations}>
				{errorPopup}
				<FactaArticleRegion title={"Donation Summary"}>
					<FullCartReport
						cartItems={this.props.cartItems}
						history={this.props.history}
						setErrors={() => {}}
						includeCancel={false}
						excludeMemberName={true}
						pageFlavor={PageFlavor.DONATE}
					/>
					<br />
				</FactaArticleRegion>
				<FactaArticleRegion title={"Your Billing Info"}>
					{paymentTextOrResetLink}
					<br />
					{confirm.getOrElse(paymentElement)}
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}