import { History } from "history";
import * as React from "react";

import PageWrapper from "../../core/PageWrapper";
import ProgressThermometer from "../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../core/WizardPageflow";
import JoomlaLoadingPage from "../../theme/joomla/JoomlaLoadingPage";
import { setCheckoutImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import GiftCertificatesDetailsPage from "./GiftCertificatesDetailsPage";
import GiftCertificatesConfirmationPage from "./GiftCertificatesConfirmationPage";
import GiftCertificatesThankYouPage from "./GiftCertificatesThankYouPage";
import {apiw as getPrices} from "@async/prices"
import {getWrapper as getGC} from "@async/member/gc-purchase"
import { apiw as orderStatus } from "@async/order-status"
import { PageFlavor } from "../../components/Page";
import {postWrapper as getProtoPersonCookie} from "@async/check-proto-person-cookie"
import { PostURLEncoded } from "../../core/APIWrapperUtil";

const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>
};

type State = {
}

export default class GiftCertificatesWizard extends React.Component<Props, State> {
	render() {
		console.log("GC Wizard")
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
					key="GiftCertificatesDetailsPage"
					history={self.props.history}
					component={(urlProps: {}, [prices, gc, status]: any) => <GiftCertificatesDetailsPage
						prices={prices}
						gc={gc}
						orderStatus={status}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => getProtoPersonCookie.send(PostURLEncoded({}))
					.then(() => Promise.all([
						getPrices.send(null),
						getGC.send(null),
						orderStatus(PageFlavor.GC).send(null),
					]) as any)}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="GiftCertificatesConfirmationPage"
					history={self.props.history}
					component={(urlProps: {}, [prices, gc, status]: any, reload: () => void) => <GiftCertificatesConfirmationPage
						reload={reload}
						history={history}
						gc={gc}
						orderStatus={status}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => Promise.all([
						getPrices.send(null),
						getGC.send(null),
						orderStatus(PageFlavor.GC).send(null),
					]).then(x => Promise.resolve(x)) as any}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="GiftCertificatesThankYouPage"
					history={self.props.history}
					component={(urlProps: {}) => <GiftCertificatesThankYouPage
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
