import { History } from "history";
import * as React from "react";

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
					key="DonateDetailsPage"
					history={self.props.history}
					component={(urlProps: {}) => <DonateDetailsPage
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="DonateConfirmationPage"
					history={self.props.history}
					component={(urlProps: {}) => <DonateConfirmationPage
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
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