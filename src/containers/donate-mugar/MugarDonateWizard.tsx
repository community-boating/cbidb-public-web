import { History } from "history";
import * as React from "react";
// import * as t from 'io-ts';

import PageWrapper from "core/PageWrapper";
import ProgressThermometer from "components/ProgressThermometer";
import { State as BreadcrumbState} from "core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "core/WizardPageflow";
import { setMugarImage } from "util/set-bg-image";
import { apBasePath } from "app/paths/ap/_base";
import {getWrapper as getDonationFunds} from "async/donation-funds"
import {apiw as getCart} from "async/get-cart-items-donate"
import { apiw as orderStatus } from "async/order-status"
import { PageFlavor } from "components/Page";
import {postWrapper as getProtoPersonCookie} from "async/check-proto-person-cookie"
import { PostURLEncoded } from "core/APIWrapperUtil";
import FactaLoadingPage from "theme/facta/FactaLoadingPage";
import MugarDonateDetailsPage from "./MugarDonateDetailsPage";
import MugarDonateConfirmationPage from "./MugarDonateConfirmationPage";
import MugarDonateThankYouPage from "./MugarDonateThankYouPage";

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

export default class MugarDonateWizard extends React.Component<Props, State> {
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
			shadowComponent: <FactaLoadingPage setBGImage={setMugarImage} />
		}
	
		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateDetailsPage"
					history={self.props.history}
					component={(urlProps: {}, [funds, cart, orderStatus]: any) => <MugarDonateDetailsPage
						donationFunds={funds}
						cartItems={cart}
						orderStatus={orderStatus}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => getProtoPersonCookie.sendFormUrlEncoded({})
					.then(() => Promise.all([
						getDonationFunds.send(),
						getCart.send(),
						orderStatus(PageFlavor.DONATE).send(),
					]) as any)}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateConfirmationPage"
					history={self.props.history}
					component={(urlProps: {}, [funds, cart, orderStatus]: any, reload: () => void) => <MugarDonateConfirmationPage
						{...staticComponentProps}
						reload={reload}
						cartItems={cart}
						orderStatus={orderStatus}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => Promise.all([
						getDonationFunds.send(),
						getCart.send(),
						orderStatus(PageFlavor.DONATE).send(),
					]) as any}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateThankYouPage"
					history={self.props.history}
					component={(urlProps: {}) => <MugarDonateThankYouPage
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