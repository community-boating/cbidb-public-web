import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import {  setCheckoutImageForDonations } from 'util/set-bg-image';
import { CartItem } from 'async/get-cart-items';
import FullCartReport from 'components/FullCartReport';
import { PageFlavor } from 'components/Page';
import { orderStatusValidator } from "async/order-status"
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import FactaButton from 'theme/facta/FactaButton';
import SquarePaymentForm, { SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';
import { FactaInfoDiv } from 'theme/facta/FactaInfoDiv';

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

export default class DonateConfirmationPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			validationErrors: []
		};
	}
	render() {
		const self = this;

		const confirm = this.props.orderStatus.cardData.map(cd => <React.Fragment>
			<FactaButton text="< Back" onClick={this.props.goPrev}/>
			<FactaButton text="Submit Donation" spinnerOnClick onClick={() => {
				self.setState({
					...self.state,
					validationErrors: []
				});
						// TODO: catch any bullcrap error after payment process
				return self.props.goNext()

			}}/>
		</React.Fragment>);

		const paymentElement = <SquarePaymentForm {...this.props.paymentPropsAsync} orderAppAlias='Donate' handleSuccess={() => {
			this.props.goNext()
		}}/>

		return (
			<FactaMainPage setBGImage={setCheckoutImageForDonations} infosOverride={["Recurring donations are currently unavailable, we expect the recurring donations system to be back online by April 1st 2025."]} errors={this.state.validationErrors}>
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
					{confirm.getOrElse(paymentElement)}
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}