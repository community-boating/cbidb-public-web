import * as React from 'react';
import * as t from 'io-ts';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
import {validator as gcValidator} from "../../async/member/gc-purchase"
import { orderStatusValidator } from "../../async/order-status"
import StripeConfirm from '../../components/StripeConfirm';

type GC = t.TypeOf<typeof gcValidator>;

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	gc: GC,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

export default class GiftCertificatesConfirmationPage extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Your Billing Info"}>
					<StripeConfirm
						cardData={this.props.orderStatus.cardData.getOrElse(null)}
					/>
					<br />
					<Button text="< Back" onClick={this.props.goPrev}/>
					<Button text="Complete Purchase" spinnerOnClick onClick={this.props.goNext}/>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}