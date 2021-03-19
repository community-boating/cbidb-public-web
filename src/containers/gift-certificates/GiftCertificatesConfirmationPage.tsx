import * as React from 'react';
import * as t from 'io-ts';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
import {validator as gcValidator} from "../../async/member/gc-purchase"
import { orderStatusValidator } from "../../async/order-status"
import StripeConfirm from '../../components/StripeConfirm';
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import { postWrapper as submitPayment } from "../../async/stripe/submit-payment-standalone"
import { makePostString } from '../../core/APIWrapperUtil';
import { PageFlavor } from '../../components/Page';

type GC = t.TypeOf<typeof gcValidator>;

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	gc: GC,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

type State = {
	validationErrors: string[]
}

export default class GiftCertificatesConfirmationPage extends React.PureComponent<Props, State> {
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
				<JoomlaArticleRegion title={"Your Billing Info"}>
					<StripeConfirm
						cardData={this.props.orderStatus.cardData.getOrElse(null)}
					/>
					<br />
					<Button text="< Back" onClick={this.props.goPrev}/>
					<Button text="Complete Purchase" spinnerOnClick onClick={() => {
						self.setState({
							...self.state,
							validationErrors: []
						});
						return submitPayment.send(makePostString("program=" + PageFlavor.GC)).then(res => {
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