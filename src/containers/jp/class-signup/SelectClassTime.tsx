import * as t from 'io-ts';
import * as React from "react";

import { getClassInstancesValidator, InstanceInfo } from '@async/junior/get-class-instances';
import JpClassesAvailTable from "@components/JpClassesAvailTable";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import { weeksValidator, Week } from '@async/weeks';
import { Select } from '@components/Select';
import { Option, none, some } from 'fp-ts/lib/Option';
import formUpdateState from '@util/form-update-state';
import * as moment from 'moment'
import {FactaErrorDiv} from '@facta/FactaErrorDiv';
import { History } from 'history';
import JpClassSignupSidebar from '@components/JpClassSignupSidebar';
import { GetSignupsAPIResult } from '@async/junior/get-signups';
import FactaButton from '@facta/FactaButton';
import NavBarLogoutOnly from '@components/NavBarLogoutOnly';
import {classPageRoute} from "@routes/jp/class"
import { setJPImage } from '@util/set-bg-image';
import FactaSidebarPage from '@facta/FactaSidebarPage';

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
	history: History<any>,
	currentSeason: number
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

		const filterInstancesByWeek = (i: InstanceInfo) => {
			if (self.state.formData.selectedWeek.isNone()) {
				return this.props.currentSeason > 2020 || i.week >= 3
			} else {
				return String(i.week) == self.state.formData.selectedWeek.getOrElse(null)
			}
		};

		const shownInstances = self.props.apiResult.instances.filter(filterInstancesByWeek)

		const times = (
			shownInstances.length == 0
			? `No ${self.props.apiResult.typeName} classes scheduled in that week.`
			: (<JpClassesAvailTable
				typeId={some(this.props.typeId)}
				instances={shownInstances}
				juniorId={some(this.props.personId)} 
				history={this.props.history}
				setValidationErrors={function(validationErrors: string[]) { return self.setState({ ...self.state, validationErrors }); }.bind(self)}
				url={this.props.history.location.pathname}
			/>)
		)
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors.flatMap(ve => ve.split("<br><br>"))}/>
			: ""
		);

		const chooseTimeRegion = (<FactaArticleRegion title="Choose a Time">
			{times}
		</FactaArticleRegion>);

        const allRegions = (
			<React.Fragment>
				{errorPopup}
				<br />
				<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(classPageRoute.pathWrapper.getPathFromArgs({ personId: String(self.props.personId) })))}/>
				<FactaArticleRegion title={`Choose a Week - ${self.props.apiResult.typeName}`}>
					<table><tbody><FormSelect
						id="selectedWeek"
						label=""
						value={formData.selectedWeek}
						updateAction={updateState}
						options={self.props.weeks.map(weekToKeyAndDisplay)}
						nullDisplay="- All Weeks -"
					/></tbody></table>
				</FactaArticleRegion>
				{chooseTimeRegion}
			</React.Fragment>
		);

		return (
			<FactaSidebarPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})} main={allRegions} right={<JpClassSignupSidebar
				signups={self.props.signups}
				history={self.props.history}
				setValidationErrors={validationErrors => self.setState({ ...self.state, validationErrors })}
			/>} />
		)
	}
}
