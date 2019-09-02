import { none, Option, some } from 'fp-ts/lib/Option';
import * as moment from 'moment';
import * as React from "react";

import range from "../util/range";
import { KeyAndDisplay, Select } from "./Select";


export interface DateTriPickerProps<U> {
	years: number[]
	monthID: string & keyof U,
	dayID: string & keyof U,
	yearID: string & keyof U,
	monthValue: Option<string>,
	dayValue: Option<string>,
	yearValue: Option<string>,
	updateAction?: (name: string, value: string) => void,
	isRequired?: boolean
}

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const leadingZero = (n: number) => n<10 ? String("0" + n) : String(n);

const dobMonthValues: KeyAndDisplay[] = months.map((m, i) => ({key: leadingZero(i+1), display: m}))

const days = range(1,31).map(i => ({key: String(leadingZero(i)), display: String(i)}))

export function componentsToDate(month: Option<string>, date: Option<string>, year: Option<string>): Option<string> {
	console.log(month)
	console.log(date)
	console.log(year)
	if (
		month.isNone() || date.isNone() || year.isNone() ||
		isNaN(Number(month.getOrElse(null))) || isNaN(Number(date.getOrElse(null))) || isNaN(Number(year.getOrElse(null))) || 
		month == null || date == null || year == null
	) return none
	const candidate = `${month.getOrElse(null)}/${date.getOrElse(null)}/${year.getOrElse(null)}`
	const candidateMoment = moment(candidate, "MM/DD/YYYY");
	console.log("setting date: ", candidateMoment)
	if (candidateMoment.isValid()) return some(candidate)
	else return none
}

export function dateStringToComponents(dateString: Option<string>): Option<{month: string, date: string, year: string}> {
	return dateString.chain(s => {
		const dobRegex = /(\d{2})\/(\d{2})\/(\d{4})/
		const dobResult = dobRegex.exec(s)
		console.log("dobResult: ", dobResult)
		console.log("input: ",s )
		if (dobResult == null) return none
		else return some({month: dobResult[1], date: dobResult[2], year: dobResult[3]})
	})
}

export default class DateTriPicker<U, T extends DateTriPickerProps<U>> extends React.PureComponent<T> {
	render() {
		const self = this
		console.log("here we go datePicker ", self.props)
		const dobDateAndYear = (function() {
			const date = <Select<U>
				id={self.props.dayID}
				justElement={true}
				value={self.props.dayValue}
				updateAction={self.props.updateAction}
				options={days}
				nullDisplay="- Day -"
			/>
			const year = <Select<U>
				id={self.props.yearID}
				justElement={true}
				value={self.props.yearValue}
				updateAction={self.props.updateAction}
				options={self.props.years.reverse().map(i => ({key: String(i), display: String(i)}))}
				nullDisplay="- Year -"
			/>

			return (
				<span>
					{" / "}
					{date}
					{" / "}
					{year}
				</span>
			)
		}());

		return <Select<U>
			id={self.props.monthID}
			label="Date of Birth"
			value={self.props.monthValue}
			updateAction={self.props.updateAction}
			options={dobMonthValues}
			appendToElementCell={dobDateAndYear}
			nullDisplay="- Month -"
			isRequired={self.props.isRequired}
		/>
	}
}