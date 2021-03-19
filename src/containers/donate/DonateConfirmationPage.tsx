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
import StripeConfirm from '../../components/StripeConfirm';
import { orderStatusValidator } from "../../async/order-status"
import { postWrapper as submitPayment } from "../../async/stripe/submit-payment-standalone"
import { makePostString } from '../../core/APIWrapperUtil';
import ErrorDiv from '../../theme/joomla/ErrorDiv';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
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
					<StripeConfirm
						cardData={this.props.orderStatus.cardData.getOrElse(null)}
					/>
					<br />
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
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}