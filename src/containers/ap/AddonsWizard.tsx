import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import PageWrapper from "../../core/PageWrapper";
import ProgressThermometer from "../../components/ProgressThermometer";
import { State as BreadcrumbState} from "../../core/Breadcrumb";
import WizardPageflow, { ComponentPropsFromWizard, WizardNode } from "../../core/WizardPageflow";
import JoomlaLoadingPage from "../../theme/joomla/JoomlaLoadingPage";
import { setAPImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import {getWrapper as gpGet } from "../../async/member/select-guest-privs"
import {getWrapper as dwGet } from "../../async/member/select-damage-waiver"
import {apiw as getPrices, validator as pricesValidator} from "../../async/prices"
import DamageWaiver from "./ap-registration/DamageWaiver";
import GuestPrivs from "./ap-registration/GuestPrivs";

const mapElementToBreadcrumbState: (element: WizardNode) => BreadcrumbState = e => ({
	path: null,
	display: e.breadcrumbHTML
})

type Props = {
	history: History<any>
};

type State = {
}

export default class AddonsWizard extends React.Component<Props, State> {
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
			shadowComponent: <JoomlaLoadingPage setBGImage={setAPImage} />
		}

		return <WizardPageflow 
			history={self.props.history}
			start={apBasePath.getPathFromArgs({})}
			end={apBasePath.getPathFromArgs({})}
			nodes={[{
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
			}]}
		/>
	}
}
