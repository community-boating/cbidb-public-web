import { History } from "history";
import * as React from "react";
import WizardPageflow, { ComponentPropsFromWizard } from "../../core/WizardPageflow";
import { Option, none, some } from "fp-ts/lib/Option";
import PageWrapper from "../../core/PageWrapper";
import { apiw as welcomeAPIAP } from "@async/member-welcome-ap";
import { apiw as welcomeAPIJP } from "@async/member-welcome-jp";
import PaymentDetailsPage from "./PaymentDetails";
import PaymentConfirmPage from "./PaymentConfirm";
import { apiw as orderStatus, CardData } from "@async/order-status"
import { setCheckoutImage } from "../../util/set-bg-image";
import { apiw as getCartItems } from "@async/get-cart-items"
import { jpBasePath } from "../../app/paths/jp/_base";
import {getWrapper as getDonationFunds} from "@async/donation-funds"
import ThankYouPage from "./ThankYou";
import { PageFlavor } from "../../components/Page";
import FactaLoadingPage from "../../theme/facta/FactaLoadingPage";

const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
	goPrev: fromWizard.goPrev,
	goNext: fromWizard.goNext
})

type Props = {
	history: History<any>,
	flavor: PageFlavor
};

type State = {
	cardData: Option<CardData>,
	hasApMemberships: boolean,
	hasJpMemberships: boolean
}

export default class CheckoutWizard extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			cardData: none,
			hasApMemberships: false,
			hasJpMemberships: false
		}
	}
	getWelcomeAPI = function() {
		switch(this.props.flavor) {
		case PageFlavor.AP:
			return welcomeAPIAP;
		case PageFlavor.JP:
			return welcomeAPIJP
		}
	}
	setCardData(cardData: CardData) {
		this.setState({
			...this.state,
			cardData: some(cardData)
		})
	}
	setHasJpMemberships() {
		this.setState({
			...this.state,
			hasJpMemberships: true
		})
	}
	setHasApMemberships() {
		this.setState({
			...this.state,
			hasApMemberships: true
		})
	}
	render() {
		const self = this;
		
		const nodes = [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout details"
				history={self.props.history}
				component={(urlProps: {}, [welcome, orderStatus, cartItems, funds]) => <PaymentDetailsPage
					{...mapWizardProps(fromWizard)}
					welcomePackage={welcome}
					orderStatus = {orderStatus}
					setCardData={this.setCardData.bind(this)}
					history={self.props.history}
					cartItems={cartItems}
					donationFunds={funds}
					flavor={this.props.flavor}
				/>}
				urlProps={{}}
				shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
				getAsyncProps={() => {
					return Promise.all([
						(self.getWelcomeAPI() as any).send(null),
						orderStatus(this.props.flavor).send(null),
						getCartItems(this.props.flavor).send(null),
						getDonationFunds.send(null)
					]).then(([welcome, order, cart, funds]) => {
						if (welcome.type == "Success" && !welcome.success.canCheckout) {
							self.props.history.push(jpBasePath.getPathFromArgs({}));
							return Promise.resolve(null);
						} else {
							if (cart.type == "Success") {
								if (cart.success.filter(c => c.itemType == "Membership").filter(c => c.itemNameHTML == "Junior Summer Membership").length) {
									this.setHasJpMemberships();
								}
								if (cart.success.filter(c => c.itemType == "Membership").filter(c => c.itemNameHTML != "Junior Summer Membership").length) {
									this.setHasApMemberships();
								}
							}
							console.log(this.state)
							return Promise.resolve([welcome, order, cart, funds])
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
					flavor={this.props.flavor}
				/>}
				urlProps={{}}
				shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
				getAsyncProps={() => {
					return Promise.all([
						orderStatus(this.props.flavor).send(null),
						getCartItems(this.props.flavor).send(null)
					]).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout confirm"
				history={self.props.history}
				component={(urlProps: {}, async: {}) => <ThankYouPage
					{...mapWizardProps(fromWizard)}
					hasAPMemberships={this.state.hasApMemberships}
					hasJPMemberships={this.state.hasJpMemberships}
				/>}
				urlProps={{}}
				shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
			/>
		}]
	
		return <WizardPageflow
			history={self.props.history}
			start="/"
			end="/"
			nodes={nodes}
		/>
	}
}
