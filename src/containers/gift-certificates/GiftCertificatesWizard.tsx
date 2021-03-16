import { History } from "history";
import * as React from "react";

import PageWrapper from "../../core/PageWrapper";
import ProgressThermometer from "../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../core/WizardPageflow";
import JoomlaLoadingPage from "../../theme/joomla/JoomlaLoadingPage";
import { setAPImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import GiftCertificatesDetailsPage from "./GiftCertificatesDetailsPage";
import GiftCertificatesConfirmationPage from "./GiftCertificatesConfirmationPage";
import GiftCertificatesThankYouPage from "./GiftCertificatesThankYouPage";
import {apiw as getPrices} from "../../async/prices"

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
			shadowComponent: <JoomlaLoadingPage setBGImage={setAPImage} />
		}
	
		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="GiftCertificatesDetailsPage"
					history={self.props.history}
					component={(urlProps: {}, async: any) => <GiftCertificatesDetailsPage
						prices={async}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={() => {
						return getPrices.send(null)
					}}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="GiftCertificatesConfirmationPage"
					history={self.props.history}
					component={(urlProps: {}) => <GiftCertificatesConfirmationPage
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
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
