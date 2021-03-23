import { History } from "history";
import * as React from "react";
// import * as t from 'io-ts';

import PageWrapper from "../../core/PageWrapper";
import ProgressThermometer from "../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../core/WizardPageflow";
import JoomlaLoadingPage from "../../theme/joomla/JoomlaLoadingPage";
import { setCheckoutImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import DonateDetailsPage from "./DonateDetailsPage";
import DonateConfirmationPage from "./DonateConfirmationPage";
import DonateThankYouPage from "./DonateThankYouPage";
import {getWrapper as getDonationFunds} from "@async/donation-funds"
import {apiw as getCart} from "@async/get-cart-items-donate"
import { apiw as orderStatus } from "@async/order-status"
import { PageFlavor } from "../../components/Page";
import {postWrapper as getProtoPersonCookie} from "@async/check-proto-person-cookie"
import { PostURLEncoded } from "../../core/APIWrapperUtil";

//type DonationFund = t.TypeOf<typeof donationFundValidator>;

const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>
};

type State = {
}

export default class DonateWizard extends React.Component<Props, State> {
	render() {
		const self = this;
		const staticComponentProps = {
			history: this.props.history
		}
	
		const mapWizardProps = (fromWizard: ComponentPropsFromWizard) => ({
			goPrev: fromWizard.goPrev,
			goNext: fromWizard.goNext,
			breadcrumb: (<ProgressThermometer
				prevStates={fromWizard.prevNodes.map(mapElementToBreadcrumbState)}
				currState={mapElementToBreadcrumbState(fromWizard.currNode)}
				nextStates={fromWizard.nextNodes.map(mapElementToBreadcrumbState)}
			/>)
		})
	
		const pageWrapperProps = {
			urlProps: {},
			shadowComponent: <JoomlaLoadingPage setBGImage={setCheckoutImage} />
		}
	
		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateDetailsPage"
					history={self.props.history}
					component={(urlProps: {}, [funds, cart, orderStatus]) => <DonateDetailsPage
						donationFunds={funds}
						cartItems={cart}
						orderStatus={orderStatus}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => getProtoPersonCookie.send(PostURLEncoded({}))
					.then(() => Promise.all([
						getDonationFunds.send(null),
						getCart.send(null),
						orderStatus(PageFlavor.DONATE).send(null),
					]) as any)}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateConfirmationPage"
					history={self.props.history}
					component={(urlProps: {}, [funds, cart, orderStatus], reload: () => void) => <DonateConfirmationPage
						{...staticComponentProps}
						reload={reload}
						cartItems={cart}
						orderStatus={orderStatus}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => Promise.all([
						getDonationFunds.send(null),
						getCart.send(null),
						orderStatus(PageFlavor.DONATE).send(null),
					]) as any}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateThankYouPage"
					history={self.props.history}
					component={(urlProps: {}) => <DonateThankYouPage
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}]}
		/>
	}
}