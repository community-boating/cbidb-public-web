import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import PageWrapper from "../../../core/PageWrapper";
import ProgressThermometer from "../../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../../core/WizardPageflow";
import ApRequiredInfo from "./ApRequiredInfo";
import { Option } from "fp-ts/lib/Option";
import JoomlaLoadingPage from "../../../theme/joomla/JoomlaLoadingPage";
import { setAPImage } from "../../../util/set-bg-image";
import { apBasePath } from "../../../app/paths/ap/_base";
import { getWrapper as requiredInfoAPI, validator as requiredInfoValidator, defaultValue as requiredFormDefault} from "../../../async/member/required";

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
					component={(urlProps: {}, async: t.TypeOf<typeof requiredInfoValidator>) => <ApRequiredInfo
						initialFormData={async}
						{...staticComponentProps}
						{...mapWizardProps(fromWizard)}
						personId={self.state.personId}
					/>}
					getAsyncProps={(urlProps: {}) => {
						if (self.state.personId.isNone()) {
							return Promise.resolve({
								type: "Success",
								success: requiredFormDefault
							});
						} else {
							return requiredInfoAPI.send(null).then(ret => {
								if (ret.type == "Failure") {
									self.props.history.push(apBasePath.getPathFromArgs({}))
								}
								return Promise.resolve(ret);
							});
						}
						
					}}
					{...pageWrapperProps}
				/>,
				breadcrumbHTML: <React.Fragment>Required<br />Info</React.Fragment>
			}]}
		/>
	}
}
