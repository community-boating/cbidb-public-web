import * as React from 'react';
import { Moment, now } from 'moment';
import * as moment from 'moment';
import * as _ from 'lodash';

type Props = {
	today: Moment,
	monthStartOnDate: number // 0 for Sunday, 1 for Monday etc
};

type State = {
	firstOfFocusedMonth: Moment
};

export default class Calendar extends React.PureComponent<Props, State> {
	static jumpToStartOfMonth(arbitraryDate: Moment): Moment {
		return arbitraryDate.clone().startOf('month');
	}

	static getDateArrayForMonth(firstOfMonth: Moment, firstDayOfWeek: number): Moment[][] {
		const priorMonthDaysToShow = (7 + Number(firstOfMonth.format('d')) - firstDayOfWeek) % 7;
		const firstDayOfFirstWeek = firstOfMonth.clone().subtract(priorMonthDaysToShow, 'days');
		const thisMonth = firstOfMonth.format('MM');

		// Given a date, return an array of seven dates, starting with the given
		const makeWeekFromStartingDate = (startDate: Moment) => _.range(7).map(i => startDate.clone().add(i, 'days'));

		// Return a 2d array of dates, containing the whole desired month, plus the leading and trailing days in the neighboring months
		const appendWeekWhileInMonth: (currentWeeks: Moment[][], startDate: Moment, doStop: boolean) => Moment[][] = (currentWeeks, startDate, doStop) => {
			if (doStop) {
				return currentWeeks;
			}

			const weekToAdd = makeWeekFromStartingDate(startDate);

			// If the next day after the week we are adding is in this month, keep recursing
			const stopNext = weekToAdd[6].clone().add(1, 'days').format('MM') !== thisMonth;

			return appendWeekWhileInMonth(
				currentWeeks.concat([weekToAdd]),
				startDate.clone().add(7, 'days'),
				stopNext,
			);
		}

		return appendWeekWhileInMonth([], firstDayOfFirstWeek, false);
	}

	static getMonthTitle(firstOfMonth: Moment): string {
		return firstOfMonth.format("MMMM YYYY")
	}

	static getDayOfWeekNames(week: Moment[]): string[] {
		return week.map(m => m.format("dddd"))
	}

	static isWeekend(m: Moment): boolean {
		const d = Number(m.format("d"));
		return d == 0 || d == 6;
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			firstOfFocusedMonth: Calendar.jumpToStartOfMonth(this.props.today)
		}
	}

	render() {
		const renderedDateArray = Calendar.getDateArrayForMonth(this.state.firstOfFocusedMonth, this.props.monthStartOnDate);
		const dayHeaders = Calendar.getDayOfWeekNames(renderedDateArray[0]).map((header, i) => <th key={i} className="DayOfWeek">{header}</th>);
		const currentMonth = this.state.firstOfFocusedMonth.format("MM");
		const isCurrentMonth = (m: Moment) => m.format("MM") == currentMonth;
		const getCellClass = (m: Moment) => {
			if (m.isSame(this.props.today, 'day')) {
				return "Today"
			} else {
				if (isCurrentMonth(m)) {
					if (Calendar.isWeekend(m)) {
						return "WeekendDay"
					} else {
						return "Day";
					}
				} else {
					return "NonDay";
				}
			}
		}
		const getDayNumberDivClass = (m: Moment) => isCurrentMonth(m) ? "DayTitle" : "NonDayTitle";

		const mainTable = (
			<table cellPadding="0" cellSpacing="0" className="Calendar">
				<tbody>
					<tr key="headers">{dayHeaders}</tr>
					{renderedDateArray.map((row, rowIndex) => (
						<tr key={`row_${rowIndex}`}>
							{row.map((m, cellIndex) => 
								<td key={`cell${cellIndex}`} className={getCellClass(m)} valign="top">
									<div className={getDayNumberDivClass(m)}>{m.format("D")}</div>
								</td>
							)}
						</tr>
					))}
				</tbody>
			</table>
		);

		return (
			<table cellPadding="0" cellSpacing="0" className="CalendarHolder" role="presentation">
				<tbody>
					<tr>
						<td className="MonthTitle">{Calendar.getMonthTitle(this.state.firstOfFocusedMonth)}</td>
					</tr>
					<tr><td>
						{mainTable}
					</td></tr>
				</tbody>
			</table>
		);
	}
}
