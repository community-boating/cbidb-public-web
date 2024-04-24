import { History } from "history";
import * as React from "react";
// import * as t from 'io-ts';

import PageWrapper from "core/PageWrapper";
import ProgressThermometer from "components/ProgressThermometer";
import { State as BreadcrumbState} from "core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "core/WizardPageflow";
import { setCheckoutImageForDonations } from "util/set-bg-image";
import { apBasePath } from "app/paths/ap/_base";
import DonateDetailsPage from "./DonateDetailsPage";
import DonateConfirmationPage from "./DonateConfirmationPage";
import DonateThankYouPage from "./DonateThankYouPage";
import {getWrapper as getDonationFunds} from "async/donation-funds"
import {apiw as getCart} from "async/get-cart-items-donate"
import { apiw as orderStatus } from "async/order-status"
import { PageFlavor } from "components/Page";
import {postWrapper as getProtoPersonCookie} from "async/check-proto-person-cookie"
import { PostURLEncoded } from "core/APIWrapperUtil";
import FactaLoadingPage from "theme/facta/FactaLoadingPage";
import { Option } from "fp-ts/lib/Option";

//type DonationFund = t.TypeOf<typeof donationFundValidator>;

const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>,
	fundCode: Option<string>
};

type State = {
}

export default class DonateWizard extends React.Component<Props, State> {
	render() {
		console.log("FUND CODE '" + this.props.fundCode + "'")
		console.log(this.props.fundCode.getOrElse("") == "priebatsch")
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
			shadowComponent: <FactaLoadingPage setBGImage={setCheckoutImageForDonations} />
		}
	
		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateDetailsPage"
					history={self.props.history}
					component={(urlProps: {}, [funds, cart, orderStatus]: any) => <DonateDetailsPage
						donationFunds={funds}
						cartItems={cart}
						orderStatus={orderStatus}
						fundCode={self.props.fundCode}
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
					component={(urlProps: {}, [funds, cart, orderStatus]: any, reload: () => void) => <DonateConfirmationPage
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