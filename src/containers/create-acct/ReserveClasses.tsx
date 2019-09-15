import { Option, none, some, Some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import * as React from "react";
import TextInput from "../../components/TextInput";
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import formUpdateState from '../../util/form-update-state';
import { Select } from '../../components/Select';
import {validator, validatorSingleRow} from "../../async/class-instances-with-avail"
import JoomlaReport from '../../theme/joomla/JoomlaReport';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_IntermediateSailing } from '../../lov/magicStrings';
import { Moment } from 'moment';
import Button from '../../components/Button';
import { PreRegistration, PreRegistrationClass } from '../../app/global-state/jp-pre-registrations';
import asc from '../../app/AppStateContainer';
import optionify from '../../util/optionify';

type ClassInstanceObject = t.TypeOf<typeof validatorSingleRow> & {
	startDateMoment: Moment,
	endDateMoment: Moment,
	isMorning: boolean
};


type Props = {
	apiResult: ClassInstanceObject[],
	preRegistrations: PreRegistration[]
}

const morningAfternoonValues = [
	"Morning",
	"Afternoon"
]

const defaultForm = {
	juniorFirstName: none as Option<string>,
	beginnerMorningAfternoon: some("Morning") as Option<string>,
	intermediateMorningAfternoon: some("Morning") as Option<string>,
	selectedBeginnerInstance: none as Option<string>,
	selectedIntermediateInstance: none as Option<string>
}

const renderClassLine = (preregClass: Option<PreRegistrationClass>) => preregClass.fold(
	"(None)",
	c => c.dateRange + ", " + c.timeRange
)

const preRegRender = (prereg: PreRegistration, i: number) => (<tr key={`prereg_${i}`}><td>
	<b>{prereg.firstName}</b><br />
	Beginner:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.beginner)}}></span><br />
	Intermediate:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.intermediate)}}></span><br />
</td></tr>);

export type Form = typeof defaultForm

type State = {
	formData: Form
}

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

const getClassDate = (classObj: ClassInstanceObject) => `${classObj.startDateMoment.format("MM/DD")}&nbsp;-&nbsp;${classObj.endDateMoment.format("MM/DD")}`;
const getClassTime = (classObj: ClassInstanceObject) => classObj.classTime.replace(/ /g, "&nbsp;");

const wrapInLabel = (statePropName: string, instanceId: string) => (s: string) =>
	<label htmlFor={`sel_${statePropName}_${instanceId}`}><span dangerouslySetInnerHTML={{__html: s as string}}></span></label>

function classReport(statePropName: keyof Form, update: (id: string, value: string) => void, selectedValue: Option<string>, classes: ClassInstanceObject[]) {
	const getRadio = (instanceId: number) => (<input
		type="radio"
		key={`sel_${statePropName}_${instanceId}`}
		id={`sel_${statePropName}_${instanceId}`}
		name={`sel_${statePropName}`}
		value={instanceId}
		onChange={(e) => update(statePropName, e.target.value)}
		checked={(function() {
			const ret = instanceId == -1 ? selectedValue.isNone() : selectedValue.getOrElse(null) == String(instanceId);
			console.log("checking instanceId ", instanceId)
			console.log("selectedVal is ", selectedValue)
			console.log("do we select? ", ret)

			return ret;
		}())}
	/>);
	const wrapInLabelNone = wrapInLabel(statePropName, "-1")
	const noneRow: React.ReactNode[] = [
		getRadio(-1),
		wrapInLabelNone("NONE"),
		wrapInLabelNone("-"),
		wrapInLabelNone("-"),
		wrapInLabelNone("-")
	]

	return (<JoomlaReport
		headers={["Select", "Class Date", "Class Time", "Spots Left", "Notes"]}
		rows={[noneRow].concat(classes.map(c => {
			const wrapInLabelSpecific = wrapInLabel(statePropName, String(c.instanceId))
			return ([
				getRadio(c.instanceId),
				wrapInLabelSpecific(getClassDate(c)),
				wrapInLabelSpecific(getClassTime(c)),
				wrapInLabelSpecific(c.spotsLeft),
				wrapInLabelSpecific(c.notes.getOrElse("-"))
			]);
		}))}
		cellStyles={[
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{}
		]}
	/>);
}

export default class ReserveClasses extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: defaultForm
		};
	}
	private timeUpdateState = (prop: string, value: string) => {
		const selectedClassFormProp: keyof Form = (prop == "beginnerMorningAfternoon" ? "selectedBeginnerInstance" : "selectedIntermediateInstance");
		let newFormPart = {};
		newFormPart[prop] = some(value);
		newFormPart[selectedClassFormProp] = none
		this.setState({
			...this.state,
			formData: {
				...this.state.formData,
				...newFormPart
			}
		})
	}
	render() {
		const self= this;
		const formData = this.state.formData;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const updateStateWrappedForID = (id: string, value: string) => {
			if ((id == "selectedBeginnerInstance" || id == "selectedIntermediateInstance") && value == "-1") {
				// empty string will be converted to none
				updateState(id as any, "");
			} else {
				updateState(id as any, value);
			}
		}

		const main = (<React.Fragment>
			<JoomlaArticleRegion title="Reserve Classes">
				New sailors should take our two-week Beginner Sailing class.
				You may also sign your child up for a two-week Intermediate Sailing class.
				We recommend signing up all new sailors/members for a one-hour Paddling Introduction so they can go paddling when not in class.
				<br />
				<br />
				<p>
					<span style={{color: "#F00", fontWeight: "bold"}}>Note that your class signup is not finalized until registration is complete and payment is processed.  </span>
					Your spots will be held for 60 minutes after submitting your first reservation.
				</p>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="First Junior">
				Please enter the name of a junior member you'd like to register, and select any classes you'd like to reserve a spot in. 
				If you have multiple juniors to register, click "Add Another Junior" below to add more.
				<br />
				<br />
				<table><tbody><FormInput
					id="juniorFirstName"
					label="Junior First Name"
					value={formData.juniorFirstName}
					updateAction={updateState}
					appendToElementCell={<span style={{color: "#777", fontSize: "0.8em"}}>  (We'll collect more information later)</span>}
				/></tbody></table>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Beginner Sailing">
				<table><tbody><FormSelect
					id="beginnerMorningAfternoon"
					label="Choose a time:  "
					value={formData.beginnerMorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedBeginnerInstance",
					updateStateWrappedForID,
					self.state.formData.selectedBeginnerInstance,
					self.props.apiResult
						.filter(c => c.typeId == jpClassTypeId_BeginnerSailing)
						.filter(c => c.isMorning == (self.state.formData.beginnerMorningAfternoon.getOrElse("") == "Morning"))
				)}
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Intermediate Sailing">
				<table><tbody><FormSelect
					id="intermediateMorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediateMorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedIntermediateInstance",
					updateStateWrappedForID,
					self.state.formData.selectedIntermediateInstance,
					self.props.apiResult
						.filter(c => c.typeId == jpClassTypeId_IntermediateSailing)
						.filter(c => c.isMorning == (self.state.formData.intermediateMorningAfternoon.getOrElse("") == "Morning"))
				)}
			</JoomlaArticleRegion>
			<Button text="Add Another Junior" onClick={() => {
				const beginner = optionify(self.props.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedBeginnerInstance.getOrElse("-1")));
				const intermediate = optionify(self.props.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedIntermediateInstance.getOrElse("-1")));
				asc.updateState.jpPreRegistrations.add({
					firstName: self.state.formData.juniorFirstName.getOrElse(""),
					beginner: beginner.map(c => ({
						instanceId: c.instanceId,
						dateRange: getClassDate(c),
						timeRange: getClassTime(c)
					})),
					intermediate: intermediate.map(c => ({
						instanceId: c.instanceId,
						dateRange: getClassDate(c),
						timeRange: getClassTime(c)
					})),
				})
				this.setState({
					...this.state,
					formData: defaultForm
				})
				window.scrollTo(0, 0)
			}}/>
		</React.Fragment>);

		const sidebar = (<JoomlaSidebarRegion title="Your Juniors"><table><tbody>
			{self.props.preRegistrations.length==0
				? <tr><td>As you reserve classes for more juniors, they will appear in this box!</td></tr>
				: self.props.preRegistrations.map(preRegRender)
			}
			</tbody></table>
			
		</JoomlaSidebarRegion>);

		return <Joomla8_4 main={main} right={sidebar} />
	}
}