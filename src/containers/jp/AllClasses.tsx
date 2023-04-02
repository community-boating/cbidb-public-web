import * as t from 'io-ts';
import * as React from "react";
import * as moment from 'moment'
import { History } from 'history';

import {validatorSingleRow} from "async/class-instances-with-avail"
import JpClassesAvailTable from "components/JpClassesAvailTable";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { weekValidator } from 'async/weeks';
import { Select } from 'components/Select';
import { Option, none } from 'fp-ts/lib/Option';
import formUpdateState from 'util/form-update-state';
import { setJPImage } from 'util/set-bg-image';
import { InstanceInfo } from 'async/junior/get-class-instances';
import FactaMainPage from 'theme/facta/FactaMainPage';

type Instance = t.TypeOf<typeof validatorSingleRow>
type Week = t.TypeOf<typeof weekValidator>;

interface Props {
	classes: Instance[],
	weeks: Week[],
	history: History<any>,
}

const defaultForm = {
	selectedWeek: none as Option<string>,
	selectedType: none as Option<string>,
}

type Form = typeof defaultForm

type State = {
	formData: Form,
}

class FormSelect extends Select<Form> {}

const reformatDate = (old: string) => moment(old, "YYYY-MM-DD").format("MM/DD")

const weekToKeyAndDisplay = (week: Week) => ({
	key: String(week.weekNumber),
	display: `${week.weekTitle} (${reformatDate(week.monday)} - ${reformatDate(week.friday)})`
})

function mapInstanceForTable(i: Instance): InstanceInfo {
	return {
		instanceId: i.instanceId,
		className: i.className,
		firstDay: i.startDatetimeRaw,
		lastDay: i.endDatetimeRaw,
		classTime: i.classTime,
		notes: i.notes,
		spotsLeft: i.spotsLeft,
		action: null,
		week: i.week,
	}
}

export default class AllClasses extends React.Component<Props, State> {
	constructor(props: Props){
		super(props)
		this.state = {
			formData: defaultForm
		};
		
		let classHash = this.props.classes.reduce((hash, c) => {
			hash[String(c.typeId)] = c.className;
			return hash;
		}, {} as any);

		this.allTypes = Object.keys(classHash).map(k => ({
			key: k,
			display: classHash[k]
		})).sort((a, b) => {
			if (a.display < b.display) return -1;
			else if (b.display < a.display) return 1;
			else return 0;
		});
	}
	allTypes: {key: string, display: string}[]
	render() {
		const self = this;
		const formData = this.state.formData
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const filterInstancesByWeek = (i: Instance) => {
			if (self.state.formData.selectedWeek.isNone()) {
				return true;
			} else {
				return String(i.week) == self.state.formData.selectedWeek.getOrElse(null)
			}
		};

		const filterInstancesByType = (i: Instance) => self.state.formData.selectedType.isNone() || String(i.typeId) == self.state.formData.selectedType.getOrElse(null)

		const shownInstances = self.props.classes
			.filter(filterInstancesByWeek)
			.filter(filterInstancesByType);

		const times = (
			shownInstances.length == 0
			? `No matching classes scheduled in that week.`
			: (<JpClassesAvailTable
				typeId={none}
				instances={shownInstances.map(mapInstanceForTable)}
				juniorId={none} 
				history={this.props.history}
				setValidationErrors={() => {}}
				setClickedInstance={() => {}}
				url={this.props.history.location.pathname}
			/>)
		)

		return (
			<FactaMainPage setBGImage={setJPImage}>
				<FactaArticleRegion title="Junior Program Classes">
					<table><tbody>
						<FormSelect
							id="selectedWeek"
							label="Week"
							value={formData.selectedWeek}
							updateAction={updateState}
							options={self.props.weeks.map(weekToKeyAndDisplay)}
							nullDisplay="- All Weeks -"
						/>
						<FormSelect
							id="selectedType"
							label="Class Type"
							value={formData.selectedType}
							updateAction={updateState}
							options={self.allTypes}
							nullDisplay="- All Classes -"
						/>
					</tbody></table>
					<br />
					{times}
				</FactaArticleRegion>
			</FactaMainPage>
		)
	}
}
