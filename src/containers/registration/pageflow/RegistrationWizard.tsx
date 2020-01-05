import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import { getWrapper as emergContactAPI, validator as emergContactValidator } from "../../../async/junior/emerg-contact";
import { getWrapper as requiredInfoAPI, validator as requiredInfoValidator, defaultValue as requiredFormDefault} from "../../../async/junior/required";
import { getWrapper as surveyAPI, validator as surveyValidator } from "../../../async/junior/survey";
import { getWrapper as swimAPI, validator as swimValidator } from "../../../async/junior/swim-proof";
import PageWrapper from "../../../core/PageWrapper";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../../core/WizardPageflow";
import Currency from "../../../util/Currency";
import ScholarshipPage from "../../Scholarship";
import EmergencyContact from "../EmergencyContact";
import RequiredInfo from "../RequiredInfo";
import SurveyInfo from "../SurveyInfo";
import TermsConditions from "../TermsConditions";
import { DoublyLinkedList } from "../../../util/DoublyLinkedList";
import ScholarshipResultsPage from "../../ScholarshipResults";
import { Option, some } from "fp-ts/lib/Option";
import { apiw as welcomeAPI } from "../../../async/member-welcome";
import { Form as HomePageForm } from '../../../containers/HomePage';
import SwimProof from "../SwimProof";

// TODO: these shouldnt be here, duplicative
export const regPath = "/reg/:personId"
export const editPath = "/edit/:personId"


const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>,
	personIdStart: Option<number>,
	jpPrice: Option<number>,
	jpOffseasonPrice: Option<number>,
	includeTOS: boolean,
	parentPersonId: number,
	currentSeason: number
};

type State = {
	personId: Option<number>,
}

export default class RegistrationWizard extends React.Component<Props, State> {
	constructor(props: Props){
		super(props)
		this.state = {
			personId: props.personIdStart
		};
	}
	render() {
		const self = this;
		const staticComponentProps = {
			history: this.props.history,
			personId: this.state.personId,
		}

		const abort = () => {
			self.props.history.push("/")
			return Promise.reject()
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
			shadowComponent: <span></span>
		}
	
		const maybeScholarship = this.props.jpPrice.isSome() ? [] : [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="ScholarshipPage"
				history={self.props.history}
				component={() => <ScholarshipPage
					parentPersonId={self.props.parentPersonId} //TODO: replace with app state
					currentSeason={self.props.currentSeason}
					jpPrice={Currency.dollars(self.props.jpPrice.getOrElse(375))} // TODO: hardcoded jp price
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Family<br />Information</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="ScholarshipResultsPage"
				history={self.props.history}
				component={(urlProps: {}, async: HomePageForm) => <ScholarshipResultsPage
					jpPrice={Currency.dollars(async.jpPrice.getOrElse(-1))}
					jpOffseasonPrice={Currency.dollars(async.jpOffseasonPrice.getOrElse(-1))}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
					goNext={() => {
						// after submitting the scholarship page,
						// do the normal goNext() stuff,
						// but then get the new DLL, take scholarship out of the left side,
						// and shove the new DLL in
						// TODO: better way to structure this to avoid a double state update?
						fromWizard.goNext()
	
						// updateState on the wizard seems to be async for this one.  Stick the DLL mutation at the end of the event queue
						// so all the react async shit happens first
						window.setTimeout(() => {
							const wizard = fromWizard.wizard;
							const dll = wizard.state.dll
							// ASssuming two scholarship pages are at the start of the flow, so we can blindly pass an empty array to `left`
							wizard.pushNewDLL(new DoublyLinkedList([], dll.curr, dll.right))
						}, 0)
	
						return Promise.resolve();
					}}
				/>}
				shadowComponent={<span></span>}
				getAsyncProps={() => {
					return welcomeAPI.send(null).catch(err => Promise.resolve(null)).then(res => {
						if (res.type != "Success" || !res.success || res.success.jpPrice.isNone() || res.success.jpOffseasonPrice.isNone()) {
							// TODO: this is bad
							return abort();
						} else return Promise.resolve(res)
					});  // TODO: handle failure
				}}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Scholarship<br />Results</React.Fragment>
		}]

		const maybeTOS = this.props.includeTOS ? [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="TermsConditions"
				history={self.props.history}
				component={() => <TermsConditions
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
					personId={self.state.personId.getOrElse(-1)}
				/>}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Terms and <br />Conditions</React.Fragment>
		}] : [];
	
		const otherNodes = [{
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="RequiredInfo"
				history={self.props.history}
				component={(urlProps: {}, async: t.TypeOf<typeof requiredInfoValidator>) => <RequiredInfo
					initialFormData={async}
					bindPersonId={personId => self.setState({ ...self.state, personId: some(personId) })}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
				/>}
				getAsyncProps={(urlProps: {}) => {
					if (self.state.personId.isNone()) {
						return Promise.resolve({
							type: "Success",
							success: requiredFormDefault
						});
					} else {
						return requiredInfoAPI(self.state.personId.getOrElse(-1)).send(null).then(ret => {
							if (ret.type == "Failure") {
								self.props.history.push("/")
							}
							return Promise.resolve(ret);
						});
					}
					
				}}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="EmergencyContact"
				history={self.props.history}
				component={(urlProps: {}, async: t.TypeOf<typeof emergContactValidator>) => <EmergencyContact
					initialFormData={async}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
					personId={self.state.personId.getOrElse(-1)}
				/>}
				getAsyncProps={(urlProps: {}) => {
					if (self.state.personId.isNone()) return abort();
					else return emergContactAPI(self.state.personId.getOrElse(-1)).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Emergency<br />Contact</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="SwimProof"
				history={self.props.history}
				component={(urlProps: {}, async: t.TypeOf<typeof swimValidator>) => <SwimProof
					initialFormData={async}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
					personId={self.state.personId.getOrElse(-1)}
				/>}
				getAsyncProps={(urlProps: {}) => {
					if (self.state.personId.isNone()) return abort();
					else return swimAPI(self.state.personId.getOrElse(-1)).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Swim<br />Proof</React.Fragment>
		}, {
			clazz: (fromWizard: ComponentPropsFromWizard) => <PageWrapper
				key="SurveyInfo"
				history={self.props.history}
				component={(urlProps: {}, async: t.TypeOf<typeof surveyValidator>) => <SurveyInfo
					initialFormData={async}
					{...staticComponentProps}
					{...mapWizardProps(fromWizard)}
					personId={self.state.personId.getOrElse(-1)}
				/>}
				getAsyncProps={(urlProps: {}) => {
					if (self.state.personId.isNone()) return abort();
					else return surveyAPI(self.state.personId.getOrElse(-1)).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
				}}
				{...pageWrapperProps}
			/>,
			breadcrumbHTML: <React.Fragment>Survey<br />Information</React.Fragment>
		}].concat(maybeTOS)
	
		const nodes = maybeScholarship.concat(otherNodes)
	
		return <WizardPageflow 
			history={self.props.history}
			start="/"
			end="/"
			nodes={nodes}
		/>
	}
}
