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

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	cartItems: CartItem[],
	history: History<any>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

export default class DonateConfirmationPage extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
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
					<Button text="Submit Donation" spinnerOnClick onClick={this.props.goNext}/>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}