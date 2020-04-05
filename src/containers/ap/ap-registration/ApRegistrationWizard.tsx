import { History } from "history";
import * as React from "react";

import PageWrapper from "../../../core/PageWrapper";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../../core/WizardPageflow";
import ApRequiredInfo from "./ApRequiredInfo";
import { Option, none } from "fp-ts/lib/Option";
import JoomlaLoadingPage from "../../../theme/joomla/JoomlaLoadingPage";
import { setAPImage } from "../../../util/set-bg-image";
import { apBasePath } from "../../../app/paths/ap/_base";

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

export default class ApRegistrationWizard extends React.Component<Props, State> {
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
					key="APRequiredInfo"
					history={self.props.history}
					component={(urlProps: {}, async: {}) => <ApRequiredInfo
						initialFormData={{
							firstName: none as Option<string>,
							lastName: none as Option<string>,
							middleInitial: none as Option<string>,
							dob: none as Option<string>,
							childEmail: none as Option<string>,
							addr1: none as Option<string>,
							addr2: none as Option<string>,
							addr3: none as Option<string>,
							city: none as Option<string>,
							state: none as Option<string>,
							zip: none as Option<string>,
							country: none as Option<string>,
							primaryPhone: none as Option<string>,
							primaryPhoneType: none as Option<string>,
							alternatePhone: none as Option<string>,
							alternatePhoneType: none as Option<string>,
							allergies: none as Option<string>,
							medications: none as Option<string>,
							specialNeeds: none as Option<string>
						}}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
						personId={self.state.personId}
					/>}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
			}]}
		/>
	}
}
