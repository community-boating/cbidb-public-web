import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import PageWrapper from "../../../core/PageWrapper";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../../core/WizardPageflow";
import ApRequiredInfo from "./ApRequiredInfo";
import JoomlaLoadingPage from "../../../theme/joomla/JoomlaLoadingPage";
import { setAPImage } from "../../../util/set-bg-image";
import { apBasePath } from "../../../app/paths/ap/_base";
import { getWrapper as requiredInfoAPI, validator as requiredInfoValidator} from "../../../async/member/required";
import { getWrapper as emergAPI, validator as emergValidator} from "../../../async/member/emerg-contact";
import ApEmergencyContact from "./ApEmergencyContact";
import GuestPrivs from "./GuestPrivs";
import DamageWaiver from "./DamageWaiver";
import ApSurveyInfo from "./ApSurveyInfo";
import { getWrapper as surveyAPI, validator as surveyValidator} from "../../../async/member/survey";
import ApTermsConditions from "./ApTermsConditions";
import ApPurchaseOptions from "./ApPurchaseOptions";
import {apiw as welcomeAPI, validator as welcomeValidator } from "../../../async/member-welcome-ap"
import {getWrapper as gpGet } from "../../../async/member/select-guest-privs"
import {getWrapper as dwGet } from "../../../async/member/select-damage-waiver"
import {apiw as getPrices, validator as pricesValidator} from "../../../async/prices"
import ApStaggeredPaymentsPage from "./ApStaggeredPaymentsPage";

const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>,
	currentSeason: number,
	editOnly: boolean
};

type State = {
}

export default class ApRegistrationWizard extends React.Component<Props, State> {

	render() {
		console.log(this.props)
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

		const purchaseNodes = [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="ApPurchaseOptions"
				history={self.props.history}
				component={(urlProps: {}, async: {welcome: t.TypeOf<typeof welcomeValidator>, prices: t.TypeOf<typeof pricesValidator>}) => <ApPurchaseOptions
					discountsProps={async.welcome.discountsResult}
					prices={async.prices}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => Promise.all([
					welcomeAPI.send(null),
					getPrices.send(null)
				]).catch(err => Promise.resolve(null)).then(([welcome, prices]) => Promise.resolve({
					type: "Success",
					success: {
						welcome: welcome.success,
						prices: prices.success
					}
				}))}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Purchasing<br />Options</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="ApPurchaseOptions"
				history={self.props.history}
				component={(urlProps: {}, async: {welcome: t.TypeOf<typeof welcomeValidator>, prices: t.TypeOf<typeof pricesValidator>}) => <ApStaggeredPaymentsPage
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => Promise.all([
					welcomeAPI.send(null),
					getPrices.send(null)
				]).catch(err => Promise.resolve(null)).then(([welcome, prices]) => Promise.resolve({
					type: "Success",
					success: {
						welcome: welcome.success,
						prices: prices.success
					}
				}))}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Payment<br />Options</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="GuestPrivs"
				history={self.props.history}
				component={(urlProps: {}, async: {wantIt: boolean, prices: t.TypeOf<typeof pricesValidator>}) => <GuestPrivs
					selected={async.wantIt}
					prices={async.prices}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => Promise.all([
					gpGet.send(null),
					getPrices.send(null)
				]).catch(err => Promise.resolve(null)).then(([wantIt, prices]) => Promise.resolve({
					type: "Success",
					success: {
						wantIt: wantIt.success.wantIt,
						prices: prices.success
					}
				}))}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Guest<br />Privileges</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="DamageWaiver"
				history={self.props.history}
				component={(urlProps: {}, async: {wantIt: boolean, prices: t.TypeOf<typeof pricesValidator>}) => <DamageWaiver
					selected={async.wantIt}
					prices={async.prices}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => Promise.all([
					dwGet.send(null),
					getPrices.send(null)
				]).catch(err => Promise.resolve(null)).then(([wantIt, prices]) => Promise.resolve({
					type: "Success",
					success: {
						wantIt: wantIt.success.wantIt,
						prices: prices.success
					}
				}))}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Damage<br />Waiver</React.Fragment>
		}];

		const termsAndConditions = {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="ApTermsConditions"
				history={self.props.history}
				component={(urlProps: {}, async: t.TypeOf<typeof surveyValidator>) => <ApTermsConditions
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => surveyAPI.send(null).catch(err => Promise.resolve(null))}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
		};
	
		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="APRequiredInfo"
					history={self.props.history}
					component={(urlProps: {}, async: t.TypeOf<typeof requiredInfoValidator>) => <ApRequiredInfo
						initialFormData={async}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={(urlProps: {}) => requiredInfoAPI.send(null).then(ret => {
						if (ret.type == "Failure") {
							self.props.history.push(apBasePath.getPathFromArgs({}))
						}
						return Promise.resolve(ret);
					})}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Information</React.Fragment>
			}, {
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="EmergencyContact"
					history={self.props.history}
					component={(urlProps: {}, async: t.TypeOf<typeof emergValidator>) => <ApEmergencyContact
						initialFormData={async}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={(urlProps: {}) => emergAPI.send(null).catch(err => Promise.resolve(null))}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
			}]
			.concat(this.props.editOnly ? [] : purchaseNodes)
			.concat([{
				clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
					key="ApSurveyInfo"
					history={self.props.history}
					component={(urlProps: {}, async: t.TypeOf<typeof surveyValidator>) => <ApSurveyInfo
						initialFormData={async}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
					/>}
					getAsyncProps={(urlProps: {}) => surveyAPI.send(null).catch(err => Promise.resolve(null))}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
			}])
		.concat(this.props.editOnly ? [] : [termsAndConditions])}
		/>
	}
}
