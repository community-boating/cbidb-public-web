import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import { getWrapper as emergContactAPI, validator as emergContactValidator } from "../../../async/junior/emerg-contact";
import { getWrapper as requiredInfoAPI, validator as requiredInfoValidator } from "../../../async/junior/required";
import { getWrapper as surveyAPI, validator as surveyValidator } from "../../../async/junior/survey";
import PageWrapper from "../../../core/PageWrapper";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State } from "../../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../../core/WizardPageflow";
import Currency from "../../../util/Currency";
import ScholarshipPage from "../../Scholarship";
import EmergencyContact from "../EmergencyContact";
import RequiredInfo from "../RequiredInfo";
import SurveyInfo from "../SurveyInfo";
import TermsConditions from "../TermsConditions";
import { DoublyLinkedList } from "../../../util/DoublyLinkedList";

export const path = "/reg/:personId"

export const formName = "registrationWizard"

const mapElementToBreadcrumbState: (element: WizardNode) => State = e => ({
	path: null,
	display: e.breadcrumbHTML
})

export default (props: {history: History<any>, personId: number, hasEIIResponse: boolean}) => {
	const staticComponentProps = {
		history: props.history,
		personId: props.personId,
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
		shadowComponent: <span>hi!</span>
	}

	const maybeScholarship = props.hasEIIResponse ? [] : [{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="ScholarshipPage"
			component={() => <ScholarshipPage
				parentPersonId={188911} //TODO: replace with app state
				currentSeason={2018}
				jpPrice={Currency.dollars(300)}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
				goNext={() => {
					// after submitting the scholarship page,
					// do the normal goNext() stuff,
					// but then get the new DLL, take scholarship out of the left side,
					// and shove the new DLL in
					// TODO: better way to structure this to avoid a double state update?
					fromWizard.goNext()
					const wizard = fromWizard.wizard;
					const dll = wizard.state.dll
					// (just gonna assume scholarship is the only thing in the left side and push in an empty array rather than slice the existing arr)
					wizard.pushNewDLL(new DoublyLinkedList([], dll.curr, dll.right))
					return Promise.resolve();
				}}
			/>}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Family<br />Information</React.Fragment>
	}]

	const otherNodes = [{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="RequiredInfo"
			component={(urlProps: {}, async: t.TypeOf<typeof requiredInfoValidator>) => <RequiredInfo
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				console.log("in getAsyncProps for requiredInfo")
				return requiredInfoAPI(props.personId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
	}, {
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="EmergencyContact"
			component={(urlProps: {}, async: t.TypeOf<typeof emergContactValidator>) => <EmergencyContact
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				return emergContactAPI(props.personId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
	}, /*{
		clazz: SwimProof,
		breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
	}, */{
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="SurveyInfo"
			component={(urlProps: {}, async: t.TypeOf<typeof surveyValidator>) => <SurveyInfo
				initialFormData={async}
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			getAsyncProps={(urlProps: {}) => {
				return surveyAPI(props.personId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
	}, {
		clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
			key="TermsConditions"
			component={() => <TermsConditions
				{...staticComponentProps}
				{...mapWizardProps(fromWizard)}
			/>}
			{...pageWrapperProps}
		/>,
		breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
	}]

	const nodes = maybeScholarship.concat(otherNodes)

	console.log("returning class")
	return <WizardPageflow 
		history={props.history}
		formName={formName}
		start="/"
		end="/"
		nodes={nodes}
	/>
}