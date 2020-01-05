import { History } from "history";
import * as React from "react";
import WizardPageflow, { ComponentPropsFromWizard } from "../../core/WizardPageflow";
import { Option, none, some } from "fp-ts/lib/Option";
import PageWrapper from "../../core/PageWrapper";
import { apiw as welcomeAPI } from "../../async/member-welcome";
import PaymentDetailsPage from "./PaymentDetails";
import PaymentConfirmPage from "./PaymentConfirm";
import { apiw as orderStatus, CardData } from "../../async/order-status"
import { setCheckoutImage } from "../../util/set-bg-image";
import { apiw as getCartItems } from "../../async/get-cart-items"

const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
	goPrev: fromWizard.goPrev,
	goNext: fromWizard.goNext
})

type Props = {history: History<any>};

type State = {
	cardData: Option<CardData>	
}

class CheckoutPageShadowComponent extends React.PureComponent {
	componentWillMount() {
		setCheckoutImage();
	}
	render() {
		return <span></span>;
	}
}

export default class CheckoutWizard extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cardData: none
		}
	}
	setCardData(cardData: CardData) {
		this.setState({
			...this.state,
			cardData: some(cardData)
		})
	}
	render() {
		const self = this;
		
		const nodes = [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout details"
				history={self.props.history}
				component={(urlProps: {}, [welcome, orderStatus, cartItems]) => <PaymentDetailsPage
					{...mapWizardProps(fromWizard)}
					welcomePackage={welcome}
					orderStatus = {orderStatus}
					setCardData={this.setCardData.bind(this)}
					history={self.props.history}
					cartItems={cartItems}
				/>}
				urlProps={{}}
				shadowComponent={<CheckoutPageShadowComponent />}
				getAsyncProps={() => {
					return Promise.all([
						welcomeAPI.send(null),
						orderStatus.send(null),
						getCartItems.send(null)
					]).then(([welcome, order, cart]) => {
						if (welcome.type == "Success" && !welcome.success.canCheckout) {
							self.props.history.push("/");
							return Promise.resolve(null);
						} else {
							return Promise.resolve([welcome, order, cart])
						}
					}).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout confirm"
				history={self.props.history}
				component={(urlProps: {}, [orderStatus, cartItems]) => <PaymentConfirmPage
					{...mapWizardProps(fromWizard)}
					orderStatus = {orderStatus}
					history={self.props.history}
					cartItems={cartItems}
				/>}
				urlProps={{}}
				shadowComponent={<CheckoutPageShadowComponent />}
				getAsyncProps={() => {
					return Promise.all([
						orderStatus.send(null),
						getCartItems.send(null)
					]).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}]
	
		return <WizardPageflow
			history={self.props.history}
			start="/"
			end="/thank-you"
			nodes={nodes}
		/>
	}
}
