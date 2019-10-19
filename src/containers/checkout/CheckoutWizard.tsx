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
import { preRegRender } from "../create-acct/ReserveClasses";

const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
	goPrev: fromWizard.goPrev,
	goNext: fromWizard.goNext
})

type Props = {history: History<any>};

export type CardData = {
	cardLast4: string,
	cardExpMonth: string,
	cardExpYear: string
	cardZip: Option<string>,
};

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
				component={(urlProps: {}, async: HomePageForm) => <PaymentDetailsPage
					{...mapWizardProps(fromWizard)}
					welcomePackage={async}
					setCardData={this.setCardData.bind(this)}
				/>}
				urlProps={{}}
				shadowComponent={<span>hi!</span>}
				getAsyncProps={() => {
					return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
			/>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="checkout details"
				component={(urlProps: {}) => <PaymentConfirmPage
					{...mapWizardProps(fromWizard)}
					cardData={this.state.cardData.getOrElse(null)}
				/>}
				urlProps={{}}
				shadowComponent={<span>hi!</span>}
				getAsyncProps={() => {
					return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
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
