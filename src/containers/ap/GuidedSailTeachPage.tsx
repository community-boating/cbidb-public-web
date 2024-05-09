import Calendar, { CalendarDayElement } from 'components/Calendar';
import * as React from 'react';
import FactaMainPage from 'theme/facta/FactaMainPage';
import { setAPImage } from 'util/set-bg-image';
import getNow from "util/getNow";
import { GUIDED_SAIL_AVAIL_SLOTS, GUIDED_SAIL_INSTANCES } from 'models/guided-sail-temp';
import * as moment from 'moment';
import { none, Option, some } from 'fp-ts/lib/Option';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import {Select} from "components/Select"
import { DATETIME_FORMAT, DATE_FORMAT } from 'util/dateUtil';
import FactaButton from 'theme/facta/FactaButton';
import {History} from 'history'
import { apBasePath } from 'app/paths/ap/_base';

type DaySlotType = {
	start: moment.Moment
	end: moment.Moment
}

export const GuidedSailTeachPage = (props: {history: History}) => {
	const [selectedDay, setSelectedDay] = React.useState(none as Option<typeof GUIDED_SAIL_AVAIL_SLOTS[number]>)
	const [selectedSlot, setSelectedSlot] = React.useState(none as Option<DaySlotType>)

	
	const [slots, setSlots] = React.useState(GUIDED_SAIL_AVAIL_SLOTS)
	const [instances, setInstances] = React.useState(GUIDED_SAIL_INSTANCES)
	const personId = 188910

	const colors = {
		text: "#3377DD",
		bg: "#BED3F4"
	}

	console.log(instances)

	const dayElements: CalendarDayElement[] = slots.map(s => {
		const matchingInstances = instances.filter(i => i.instructorId == personId && moment(i.startDatetime).format(DATE_FORMAT) == s.day)
		return {
			dayMoment: moment(s.day),
			elements: [{
				id: 1,
				display: <span style={{
					color: colors.text,
					backgroundColor: selectedDay.filter(d => d.day == s.day).isSome() ? colors.bg : undefined,
				}}>{`Slots: ${s.start} - ${s.end}`}{
					matchingInstances.map(i => <><br />&nbsp;&nbsp;--&nbsp;{`${moment(i.startDatetime).format("hh:mmA")}-${moment(i.endDatetime).format("hh:mmA")}`}</>)
				}</span>,
				onClick: () => {
					setSelectedDay(some(s))
					setSelectedSlot(none)
				}
			}]
		}
	})

	const daySlots = React.useMemo(() => {
		return selectedDay.map(d => {
			var stopBy = moment(`${d.day}T${d.end}`)
			var ret = [];
			var start = moment(`${d.day}T${d.start}`)
			var end = start.clone().add(90, 'minutes')
			while (end.isSameOrBefore(stopBy)) {
				ret.push({
					start: start.clone(),
					end: end.clone()
				})
				start.add(15, 'minutes')
				end.add(15, 'minutes')
			}
			return ret;
		}).getOrElse([])
	}, [selectedDay])

	const existingSignups = React.useMemo(() => {
		return selectedDay.chain(d => {
			const matchingInstances = instances.filter(i => i.instructorId == personId && moment(i.startDatetime).format(DATE_FORMAT) == d.day)
			if (matchingInstances.length == 0) return none;
			else return some(matchingInstances)
		}).map(is => {
			const style = {
				padding: "10px"
			}
			return <FactaArticleRegion title="Current Signups">
				<table><tbody>
					<tr>
						<th style={style}>Time</th>
						<th style={style}>Signups</th>
						<th style={style}>Cancel</th>
					</tr>
					{is.map(i => <tr>
						<td style={style}>{`${moment(i.startDatetime).format("hh:mmA")} - ${moment(i.endDatetime).format("hh:mmA")}`}</td>
						<td style={style}>{i.signupCt}</td>
						<td style={style}><a href="#" onClick={e => {
							e.preventDefault()
							if(confirm("Are you sure you wish to cancel this guided sail appt?"))
								setInstances((s) => s.filter((a) => a != i))
						}}>Cancel</a></td>
					</tr>)}
				</tbody></table>
			</FactaArticleRegion>
		}).getOrElse(null)
	}, [selectedDay, instances])

	const dayRegion = React.useMemo(() => {
		const options = daySlots.map(s => ({
			key: s.start.format(DATETIME_FORMAT),
			display: `${s.start.format("hh:mmA")}-${s.end.format("hh:mmA")}`
		}))
		return selectedDay.map(d => <FactaArticleRegion title={`Sign up to teach Guided Sail on ${d.day}`} id="focus">
			<Select id="new-slot" justElement value={selectedSlot.map(m => m.start.format(DATETIME_FORMAT))} options={options} nullDisplay="- Select -" updateAction={(name, value) => {
				if (value == "") setSelectedSlot(none)
				else setSelectedSlot(daySlots.filter((a) => a.start.isSame(moment(value, DATETIME_FORMAT))).map((a) => some(a))[0] || none)
			}} />
		</FactaArticleRegion>).getOrElse(null)
	}, [selectedSlot, selectedDay, daySlots])

	const signupButton = React.useMemo(() => {
		return selectedSlot.map(s => <>
			<FactaButton text="Signup" onClick={() => {
				if(confirm("Are you sure you want to sign up to teach Guided Sail?"))
					setInstances((b) => b.concat([{
						startDatetime: s.start.format(),
						endDatetime: s.end.format(),
						instructorId: personId,
						signupCt: 0,
						maxSignups: 2
				}]))
					selectedSlot
				return Promise.resolve()
			}}/>
		</>).getOrElse(null)
	}, [selectedSlot])

	return <FactaMainPage setBGImage={setAPImage}>
		<Calendar
			monthStartOnDate={0}
			today={getNow()}
			days={dayElements}
			showElementsInAdjacentMonths={false}
		/><br />
		<FactaButton text="< Back" onClick={() => Promise.resolve(props.history.push(apBasePath.getPathFromArgs({})))}/>
		{existingSignups}
		{dayRegion}
		{signupButton}
	</FactaMainPage>
}