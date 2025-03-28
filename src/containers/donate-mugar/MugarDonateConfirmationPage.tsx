import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import { setMugarImage } from 'util/set-bg-image';
import { CartItem } from 'async/get-cart-items';
import FullCartReport from 'components/FullCartReport';
import { PageFlavor } from 'components/Page';
import { orderStatusValidator } from "async/order-status"
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import SquarePaymentForm, { SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	reload: () => void,
	cartItems: CartItem[],
	history: History<any>,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
	paymentPropsAsync: SquarePaymentFormPropsAsync
}

type State = {
	validationErrors: string[]
}

export default class MugarDonateConfirmationPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			validationErrors: []
		};
	}
	render() {

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const paymentElement = <SquarePaymentForm {...this.props.paymentPropsAsync} orderAppAlias="Donate" handleSuccess={() => {
			this.props.goNext()
		}}/>

		return (
			<FactaMainPage setBGImage={setMugarImage}>
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
					{paymentElement}
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}