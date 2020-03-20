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
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import { History } from 'history';
import JpClassSignupSidebar from '../../components/JpClassSignupSidebar';
import { GetSignupsAPIResult } from '../../async/junior/get-signups';
import Button from '../../components/Button';
import NavBarLogoutOnly from '../../components/NavBarLogoutOnly';

export type APIResult = t.TypeOf<typeof getClassInstancesValidator>

export enum ClassAction {
	UNENROLL="Unenroll",
	DELIST="Delist",
	BEGUN="Begun",
	ENROLL="Enroll",
	WAIT_LIST="Wait List",
	NOT_AVAILABLE="Not Available"
}

interface Props {
	typeId: number,
	personId: number,
	apiResult: APIResult,
	weeks: t.TypeOf<typeof weeksValidator>,
	signups: GetSignupsAPIResult,
	history: History<any>
}

const defaultForm = {
	selectedWeek: none as Option<string>
}

type Form = typeof defaultForm

type State = {
	formData: Form,
	validationErrors: string[]
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
			formData: defaultForm,
			validationErrors: []
		}
	}
	render() {
		const self = this;
		const formData = this.state.formData
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const filterInstancesByWeek = (i: InstanceInfo) => self.state.formData.selectedWeek.isNone() || String(i.week) == self.state.formData.selectedWeek.getOrElse(null)

		const shownInstances = self.props.apiResult.instances.filter(filterInstancesByWeek)

		const times = (
			shownInstances.length == 0
			? `No ${self.props.apiResult.typeName} classes scheduled in that week.`
			: (<JpClassesAvailTable
				typeId={this.props.typeId}
				instances={shownInstances}
				juniorId={this.props.personId} 
				history={this.props.history}
				setValidationErrors={function(validationErrors: string[]) { return self.setState({ ...self.state, validationErrors }); }.bind(self)}
				url={this.props.history.location.pathname}
			/>)
		)
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors.flatMap(ve => ve.split("<br><br>"))}/>
			: ""
		);

        const allRegions = (
			<React.Fragment>
				{errorPopup}
				<br />
				<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push(`/class/${self.props.personId}`))}/>
				<JoomlaArticleRegion title={`Choose a Week - ${self.props.apiResult.typeName}`}>
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
			<Joomla8_4 navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none})} main={allRegions} right={<JpClassSignupSidebar
				signups={self.props.signups}
				history={self.props.history}
				setValidationErrors={validationErrors => self.setState({ ...self.state, validationErrors })}
			/>} />
		)
	}
}