import * as t from 'io-ts';
import * as React from "react";

import { getClassInstancesValidator, instanceValidator, InstanceInfo } from '../../async/junior/get-class-instances';
import JpClassesAvailTable from "../../components/JpClassesAvailTable";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";
import JoomlaNotitleRegion from '../../theme/joomla/JoomlaNotitleRegion';
import { weeksValidator, Week } from '../../async/weeks';
import { Select } from '../../components/Select';
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from '../../util/form-update-state';
import * as moment from 'moment'

export type APIResult = t.TypeOf<typeof getClassInstancesValidator>

enum ClassAction {
	UNENROLL="Unenroll",
	DELIST="Delist",
	BEGUN="Begun",
	ENROLL="Enroll",
	WAIT_LIST="Wait List",
	NOT_AVAILABLE="Not Available"
}

interface Props {
	personId: number,
	apiResult: APIResult,
	weeks: t.TypeOf<typeof weeksValidator>
}

const defaultForm = {
	selectedWeek: none as Option<string>
}

type Form = typeof defaultForm

type State = {
	formData: Form
}

class FormSelect extends Select<Form> {}

const reformatDate = (old: string) => moment(old, "YYYY-MM-DD").format("MM/DD")

const weekToKeyAndDisplay = (week: Week) => ({
	key: String(week.weekNumber),
	display: `${week.weekTitle} (${reformatDate(week.monday)} - ${reformatDate(week.friday)})`
})

export default class SelectClassTime extends React.Component<Props, State> {
	constructor(props: Props){
		super(props)
		this.state = {
			formData: defaultForm
		}
	}
	render() {
		const self = this;
		const formData = this.state.formData
		const className = <span style={{fontWeight: "bold"}}>{self.props.apiResult.typeName}</span>;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const filterInstancesByWeek = (i: InstanceInfo) => self.state.formData.selectedWeek.isNone() || String(i.week) == self.state.formData.selectedWeek.getOrElse(null)

		const shownInstances = self.props.apiResult.instances.filter(filterInstancesByWeek)

		const times = (
			shownInstances.length == 0
			? `No ${self.props.apiResult.typeName} classes scheduled in that week.`
			: <JpClassesAvailTable instances={shownInstances} />
		)

        const allRegions = (
			<React.Fragment>
				<JoomlaArticleRegion title="Choose a Week">
					{"All "}
					{className}
					{` classes are ${self.props.apiResult.sessionLength} hours per day for ${self.props.apiResult.sessionCt} day(s) unless otherwise indicated.`}
					<br />
					<br />
					<table><tbody><FormSelect
						id="selectedWeek"
						label=""
						value={formData.selectedWeek}
						updateAction={updateState}
						options={self.props.weeks.map(weekToKeyAndDisplay)}
						nullDisplay="- All Weeks -"
					/></tbody></table>
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title="Choose a Time">
					{times}
				</JoomlaArticleRegion>
				
			</React.Fragment>
		);

		return (
			<Joomla8_4 main={allRegions} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}