import { Option, none, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import * as React from "react";
import TextInput from "../../components/TextInput";
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import formUpdateState from '../../util/form-update-state';
import { Select } from '../../components/Select';
import {validator, validatorSingleRow, scrapeClassDayAndDate} from "../../async/class-instances-with-avail"
import JoomlaReport from '../../theme/joomla/JoomlaReport';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_IntermediateSailing } from '../../lov/magicStrings';

type ApiResult = t.TypeOf<typeof validator>;

type Props = {
	apiResult: ApiResult
}

const morningAfternoonValues = [
	"Morning",
	"Afternoon"
]

const defaultForm = {
	juniorFirstName: none as Option<string>,
	beginnerMorningAfternoon: some("Morning") as Option<string>,
	intermediateMorningAfternoon: some("Morning") as Option<string>,
}

export type Form = typeof defaultForm

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

export default class CreateAccount extends React.Component<Props, {formData: Form}> {
	constructor(props: Props) {
		super(props);
		console.log("constructing createAccount, ", props)
		this.state = {
			formData: defaultForm
		};
	}
	render() {
		const self= this;
		const formData = this.state.formData;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		function getClassDate(classObj: t.TypeOf<typeof validatorSingleRow>): Option<string> {
			const parsedStartDate = scrapeClassDayAndDate(classObj.firstDay);
			const parsedEndDate = scrapeClassDayAndDate(classObj.lastDay);
			const stripYear = mmddyyyy => {
				const regex = /(\d\d\/\d\d)\/\d\d\d\d/
				return regex.exec(mmddyyyy)[1]
			}
			return parsedStartDate.chain(start => {
				return parsedEndDate.map(end => {
					return stripYear(start.date) + "&nbsp;-&nbsp;" + stripYear(end.date)
				})
			})
		}

		function classReport(classes: ApiResult) {
			return (<JoomlaReport
				headers={["Class Name", "First Day", "Last Day", "Class Time", "Spots Left", "Notes"]}
				rows={classes.map(c => ([
					getClassDate(c).getOrElse("-"),
					c.className,
					c.classTime,
					c.spotsLeft,
					c.notes.getOrElse("-")
				]))}
				cellStyles={[
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{}
				]}
				rawHtml={{0: true, 2: true, 4: true, 5: true}}
			/>);
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
					updateAction={updateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(self.props.apiResult.filter(c => c.typeId == jpClassTypeId_BeginnerSailing))}
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Intermediate Sailing">
				<table><tbody><FormSelect
					id="intermediateMorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediateMorningAfternoon}
					updateAction={updateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(self.props.apiResult.filter(c => c.typeId == jpClassTypeId_IntermediateSailing))}
			</JoomlaArticleRegion>
		</React.Fragment>);

		const sidebar = (<JoomlaSidebarRegion title="Your Juniors">
			As you reserve classes for more juniors, they will appear in this box!
		</JoomlaSidebarRegion>);

		return <Joomla8_4 main={main} right={sidebar} />
	}
}