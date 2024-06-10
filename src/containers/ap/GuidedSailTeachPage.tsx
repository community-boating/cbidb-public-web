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
import { DATETIME_FORMAT_API, DATE_FORMAT_API, TIME_FORMAT } from 'util/dateUtil';
import FactaButton from 'theme/facta/FactaButton';
import {History} from 'history'
import { apBasePath } from 'app/paths/ap/_base';
import { GuidedSailInstancesType, GuidedSailSlotsType, cancelTeachGuidedSail, getCurrentGuidedSailInstances, getGuidedSailSlots, signupTeachGuidedSail } from 'async/ap/guided-sail-teach';
import { PostURLEncoded } from 'core/APIWrapperUtil';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';

type DaySlotType = {
	start: moment.Moment
	end: moment.Moment
}

function toDatetime(date: string, time: string){
	return moment(date + '  ' + time, DATETIME_FORMAT_API)
}

export const GuidedSailTeachPage = (props: {history: History}) => {
	const [guidedSailSlotData, setGuidedSailSlotData] = React.useState<{[key: string]: GuidedSailSlotsType}>({})
	const [selectedDay, setSelectedDay] = React.useState(none as Option<typeof GUIDED_SAIL_AVAIL_SLOTS[number]>)
	const [selectedSlotKey, setSelectedSlotKey] = React.useState(none as Option<string>)
	
	const guidedSailSlotDataRequested = React.useRef<{[key: string]: true}>({})
	//const [slots, setSlots] = React.useState(GUIDED_SAIL_AVAIL_SLOTS)
	const [instances, setInstances] = React.useState<GuidedSailInstancesType>(GUIDED_SAIL_INSTANCES)
	const [calendarState, setCalendarState] = React.useState({firstOfFocusedMonth: Calendar.jumpToStartOfMonth(moment())})
	const [validationErrors, setValidationErrors] = React.useState<string[]>([])

	const colors = {
		text: "#3377DD",
		bg: "#BED3F4"
	}

	const requestGuidedSailData = (forMonth: moment.Moment) => {
		const curMonthS = forMonth.format()
		if(!guidedSailSlotDataRequested.current[curMonthS]){
			guidedSailSlotDataRequested.current[curMonthS] = true
			getGuidedSailSlots(forMonth.get('year'), forMonth.get('month') + 1).send(null).then((a) => {
				if(a.type == 'Success'){
					setGuidedSailSlotData(data => ({...data, [curMonthS]: a.success}))
				}else{
					console.log("failed it")
					console.log(a.message)
				}
			})
		}
	}

	React.useEffect(() => {
		getCurrentGuidedSailInstances.send(null).then((a) => {
			if(a.type == 'Success'){
				setInstances(a.success)
			}else{
				console.log("failed it")
				console.log(a.message)
			}
		})
	}, [])
	React.useEffect(() => {
		requestGuidedSailData(calendarState.firstOfFocusedMonth)
		requestGuidedSailData(calendarState.firstOfFocusedMonth.clone().subtract(1, 'month'))
		requestGuidedSailData(calendarState.firstOfFocusedMonth.clone().add(1, 'month'))
	}, [calendarState.firstOfFocusedMonth])

	const slotRanges = React.useMemo(() => {
		return (guidedSailSlotData[calendarState.firstOfFocusedMonth.format()] || []).filter(slot => slot.slots.length > 0).map(slot => ({day: slot.day, start: slot.slots[0][0], end: slot.slots[slot.slots.length - 1][1]}))
	}, [guidedSailSlotData, calendarState])

	const dayElements: CalendarDayElement[] = slotRanges.map(s => {
		const matchingInstances = instances.filter(i => moment(i.startDatetime, DATETIME_FORMAT_API).format(DATE_FORMAT_API) == s.day)
		return {
			dayMoment: moment(s.day, DATE_FORMAT_API),
			elements: [{
				id: 1,
				display: <span style={{
					color: colors.text,
					backgroundColor: selectedDay.filter(d => d.day == s.day).isSome() ? colors.bg : undefined,
				}}>{`Slots: ${s.start} - ${s.end}`}{
					matchingInstances.map(i => <React.Fragment key={i.instanceId}><br />&nbsp;&nbsp;--&nbsp;{`${moment(i.startDatetime, DATETIME_FORMAT_API).format("hh:mmA")}-${moment(i.startDatetime, DATETIME_FORMAT_API).add(i.sessionLength * 60, 'minutes').format("hh:mmA")}`}</React.Fragment>)
				}</span>,
				onClick: () => {
					setSelectedDay(some(s))
				}
			}]
		}
	})

	const currentInstanceStarts = React.useMemo(() => {
		return instances.reduce((a, b) => {
			a[b.startDatetime] = true
			return a
		}, {} as {[key: string]: true} )
	}, [instances])

	const daySlots = React.useMemo(() => {
		return selectedDay.map(d => {
			const daySlot = guidedSailSlotData[calendarState.firstOfFocusedMonth.format()].find(daySlot => daySlot.day == d.day)
			return daySlot.slots.map(slot => ({start: toDatetime(d.day, slot[0]), end: toDatetime(d.day, slot[1])})).filter(slot => currentInstanceStarts[slot.start.format(DATETIME_FORMAT_API)] != true);
		}).getOrElse([])
	}, [selectedDay, currentInstanceStarts])

	const existingSignups = React.useMemo(() => {
		return selectedDay.chain(d => {
			const matchingInstances = instances.filter(i => moment(i.startDatetime, DATETIME_FORMAT_API).format(DATE_FORMAT_API) == d.day)
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
					{is.map(i => <tr key={i.instanceId}>
						<td style={style}>{`${moment(i.startDatetime, DATETIME_FORMAT_API).format("hh:mmA")} - ${moment(i.startDatetime, DATETIME_FORMAT_API).add(i.sessionLength * 60, 'minutes').format("hh:mmA")}`}</td>
						<td style={style}>{i.signupCt}</td>
						<td style={style}><a href="#" onClick={e => {
							e.preventDefault()
							if(confirm("Are you sure you wish to cancel this guided sail appt?")){
								cancelTeachGuidedSail(i.instanceId).send(PostURLEncoded({})).then(r => {
									if(r.type == 'Success'){
										if(r.success == 'OK'){
											setInstances((s) => s.filter((a) => a != i))
										}else{
											setValidationErrors([r.success])
										}
									}else{
										setValidationErrors(["Failed cancelling guided sail appointment"])
									}
								})
							}
						}}>Cancel</a></td>
					</tr>)}
				</tbody></table>
			</FactaArticleRegion>
		}).getOrElse(null)
	}, [selectedDay, instances])

	const makeKey = (slot: DaySlotType) => {
		return slot.start.format(TIME_FORMAT) + "-" + slot.start.format(TIME_FORMAT)
	}

	const dayRegion = React.useMemo(() => {
		const options = daySlots.map(s => ({
			key: makeKey(s),
			display: `${s.start.format("hh:mmA")}-${s.end.format("hh:mmA")}`
		}))
		return selectedDay.map(d => <FactaArticleRegion title={`Sign up to teach Guided Sail on ${d.day}`} id="focus">
			<Select id="new-slot" justElement value={selectedSlotKey} options={options} nullDisplay="- Select -" updateAction={(name, value) => {
				if (value == "") setSelectedSlotKey(none)
				else setSelectedSlotKey(some(value))
			}} />
		</FactaArticleRegion>).getOrElse(null)
	}, [selectedSlotKey, selectedDay, daySlots])

	const signupButton = React.useMemo(() => {
		return selectedSlotKey.map(s => <>
			<FactaButton text="Signup" onClick={() => {
				const selectedSlot = daySlots.find(slot => makeKey(slot) == s)
				if(confirm("Are you sure you want to sign up to teach Guided Sail?")){
					signupTeachGuidedSail(selectedSlot.start).send(PostURLEncoded({})).then((a) => {
						if(a.type == "Success"){
							if(a.success.errors.isNone()){
								setInstances((b) => b.concat([{
									startDatetime: selectedSlot.start.format(DATETIME_FORMAT_API),
									//endDatetime: s.end.format(),
									instanceId: a.success.instanceId.getOrElse(-1),
									sessionLength: 1.5,
									//instructorId: personId,
									signupCt: a.success.signupCt.getOrElse(0),
									maxSignups: 2
								}]))
							}else{
								setValidationErrors([a.success.errors.value])
							}
						}else{
							setValidationErrors(["Failed to signup for guided sail session"])
						}
					})
				}
				selectedSlot
				return Promise.resolve()
			}}/>
		</>).getOrElse(null)
	}, [selectedSlotKey, selectedDay])

	const errorPopup = (
		(validationErrors.length > 0)
		? <FactaErrorDiv errors={validationErrors}/>
		: ""
	);

	return <FactaMainPage setBGImage={setAPImage}>
		<Calendar
			monthStartOnDate={0}
			today={getNow()}
			days={dayElements}
			showElementsInAdjacentMonths={false}
			stateControlled={{state: calendarState, setState: setCalendarState}}
		/><br />
		<FactaButton text="< Back" onClick={() => Promise.resolve(props.history.push(apBasePath.getPathFromArgs({})))}/>
		{errorPopup}
		{existingSignups}
		{dayRegion}
		{signupButton}
	</FactaMainPage>
}