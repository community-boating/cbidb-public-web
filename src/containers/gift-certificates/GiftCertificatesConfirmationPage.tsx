import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import { setCheckoutImage } from 'util/set-bg-image';
import {validator as gcValidator} from "async/member/gc-purchase"
import { orderStatusValidator } from "async/order-status"
import { makePostJSON, makePostString } from 'core/APIWrapperUtil';
import { PageFlavor } from 'components/Page';
import GiftCertConfirmationRegion from './GiftCertConfirmationRegion';
import PlainButton from 'components/PlainButton';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import FactaButton from 'theme/facta/FactaButton';
import SquarePaymentForm, { SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';
import { FactaInfoDiv } from 'theme/facta/FactaInfoDiv';

type GC = t.TypeOf<typeof gcValidator>;

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	reload: () => void,
	gc: GC,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
	history: History<any>,
	paymentPropsAsnyc: SquarePaymentFormPropsAsync
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
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const confirm = this.props.orderStatus.cardData.map(cd => <React.Fragment>
			<br />
			By accepting the button to "Submit Payment", you understand the terms and conditions of our gift certificates:
			<br /><br />
			Gift certificates can be redeemed at any time, and memberships will begin at that time.
			Gift certificates are based on a monetary value. Gift certificates are available in any amount you specify
			towards the purchase of Adult Program memberships, merchandise, or additional add-ons.
			Gift certificates cannot be redeemed for cash and are non-refundable. Gift certificates may be transferred
			upon contacting our Front Office. If a gift certificate is lost or stolen, contact our Front Office immediately
			to deactivate the old gift certificate and reissue a new gift certificate by e-mail.
			All gift certificates are valid for up to seven years from the date of purchase.
			<br /><br />
			<FactaButton text="< Back" onClick={this.props.goPrev}/>
			<FactaButton text="Submit Payment" spinnerOnClick onClick={() => {
				self.setState({
					...self.state,
					validationErrors: []
				});
				
						// TODO: catch any bullcrap error after payment process
				return self.props.goNext()
					
			}}/>
			</React.Fragment>);

		const paymentElement = <SquarePaymentForm {...this.props.paymentPropsAsnyc} orderAppAlias='GC' handleSuccess={() => {
			this.props.goNext()
		}} setPaymentErrors={(errors) => {
			this.setState((s) => ({...s, validationErrors: errors}))
		}}/>
		return (
			<FactaMainPage setBGImage={setCheckoutImage}>
				{errorPopup}
				<FactaArticleRegion title="Gift Certificate Order">
					<GiftCertConfirmationRegion {...this.props.gc} />
				</FactaArticleRegion>
				<FactaArticleRegion title={"Your Billing Info"}>
					{confirm.getOrElse(paymentElement)}
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}