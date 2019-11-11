import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";
import WizardPageflow, { WizardNode, ComponentPropsFromWizard } from "../../core/WizardPageflow";
import { State as BreadcrumbState } from "../../core/Breadcrumb"
import { Option, none, Some, some } from "fp-ts/lib/Option";
import PageWrapper from "../../core/PageWrapper";
import { Form as HomePageForm } from '../HomePage';
import { apiw as welcomeAPI } from "../../async/member-welcome";
import PaymentDetailsPage from "./PaymentDetails";
import PaymentConfirmPage from "./PaymentConfirm";
import { apiw as orderStatus, CardData, OrderStatus } from "../../async/order-status"

const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
	goPrev: fromWizard.goPrev,
	goNext: fromWizard.goNext
})

type Props = {history: History<any>};

type State = {
	cardData: Option<CardData>	
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
				component={(urlProps: {}, [welcome, orderStatus]) => <PaymentDetailsPage
					{...mapWizardProps(fromWizard)}
					welcomePackage={welcome}
					orderStatus = {orderStatus}
					setCardData={this.setCardData.bind(this)}
					history={self.props.history}
				/>}
				urlProps={{}}
				shadowComponent={<span></span>}
				getAsyncProps={() => {
					console.log("getting async for DETAILS")
					return Promise.all([
						welcomeAPI.send(null),
						orderStatus.send(null)
					]).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout confirm"
				component={(urlProps: {}, orderStatus: OrderStatus) => <PaymentConfirmPage
					{...mapWizardProps(fromWizard)}
					orderStatus = {orderStatus}
					history={self.props.history}
				/>}
				urlProps={{}}
				shadowComponent={<span></span>}
				getAsyncProps={() => {
					console.log("getting async for CONFIRM")
					return orderStatus.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}]
	
		console.log("returning class")
		return <WizardPageflow
			history={self.props.history}
			start="/"
			end="/"
			nodes={nodes}
		/>
	}
}
