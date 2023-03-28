import { apBasePath } from 'app/paths/ap/_base';
import Calendar, { CalendarDayElement } from "components/Calendar";
import * as React from 'react';
import * as t from 'io-ts';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import FactaButton from 'theme/facta/FactaButton';
import FactaMainPage from 'theme/facta/FactaMainPage';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as _ from 'lodash'
import getNow from 'util/getNow';
import { setAPImage } from 'util/set-bg-image';
import {History} from 'history'
import {validator as typesValidator} from "async/member/ap-class-type-avail"
import {resultValidator as classesValidator, instanceValidator} from "async/member/ap-classes-for-calendar"
import { Option, some } from 'fp-ts/lib/Option';
import { validator as welcomeValidatorAP } from "async/member-welcome-ap";
import { FactaHideShowRegion } from 'theme/facta/FactaHideShowRegion';
import { CheckboxGroup } from 'components/InputGroup';
import { ApClassInstanceInstructorInfo } from 'async/member/ap-class-instances-instructor-info';
import {postWrapper as attemptTeach} from "async/member/ap-teach-instance"
import {postWrapper as cancelTeach} from "async/member/ap-cancel-teach-instance"
import { makePostJSON } from 'core/APIWrapperUtil';
import { FactaErrorDiv } from "theme/facta/FactaErrorDiv";
import { apPathClassesTeach } from 'app/paths/ap/classes-teach';

enum AvailabilityState {
	CLASS_ENDED,
	AM_TEACHING,
	CANNOT_TEACH,
	SOMEONE_ELSE_TEACHING,
	AVAILABLE
}

type SessionObject = {
	instanceId: number,
	sessionId: number,
	typeName: string,
	isContinuation: boolean,
	sessionStartString: string,
	sessionStartMoment: Moment,
	sessionStartDayString: string,
	signupType: Option<string>,
	waitlistResult: Option<string>,
	availabilityFlag: number,
	canTeach: boolean,
	instructorId: Option<number>
}

type Instance = t.TypeOf<typeof instanceValidator>

type Form = {
	eligibleClasses: string[]
	ineligibleClasses: string[]
}

class FormCheckbox extends CheckboxGroup<Form>{}

export const ApVolunteerClassPage = (props: {
	history: History,
	availabilities: t.TypeOf<typeof typesValidator>,
	instances: Instance[],
	welcomeData: t.TypeOf<typeof welcomeValidatorAP>,
	instructorInfo: ApClassInstanceInstructorInfo[]
}) => {
	const [focusedInstanceId, setFocusedInstanceId] = React.useState(null as number)
	const [validationErrors, setValidationErrors] = React.useState([] as string[])

	const instructorInfoHash = React.useMemo(() => props.instructorInfo.reduce((agg, e) => {
		agg[e.instanceId] = e;
		return agg;
	}, {} as {[K: number]: ApClassInstanceInstructorInfo}), [props.instructorInfo])

	const errorPopup = (
		(validationErrors.length > 0)
		? <FactaErrorDiv errors={validationErrors}/>
		: ""
	);
	
	const initSelectedClasses: Form = props.availabilities.types.reduce((agg, t) => {
		if (t.canTeach) agg.eligibleClasses = [t.typeId].concat(agg.eligibleClasses)
		// else agg.ineligibleClasses = [t.typeId].concat(agg.ineligibleClasses)
		return agg;
	}, {eligibleClasses: [], ineligibleClasses: []});

	const [selectedClasses, setSelectedClasses] = React.useState(initSelectedClasses)

	const canTeachHash = props.availabilities.types.reduce((hash, type) => {
		hash[String(type.typeId)] = type.canTeach;
		return hash;
	}, {} as {[K: string] : boolean});

	function availability(instance: Instance, firstSessionStart: Moment, canTeach: boolean): AvailabilityState {
		const now = getNow();
		if (now.isAfter(firstSessionStart)) {
			return AvailabilityState.CLASS_ENDED;
		} else if (instance.instructorId.filter(i => i == props.welcomeData.personId).isSome()) {
			return AvailabilityState.AM_TEACHING;
		} else if (!canTeach) {
			return AvailabilityState.CANNOT_TEACH;
		} else if (instance.instructorId.isSome()) { // someone else is already teaching it
			return AvailabilityState.SOMEONE_ELSE_TEACHING
		} else {
			return AvailabilityState.AVAILABLE;
		}
	}

	const getDisplayForSession: (s: SessionObject, instance: Instance, firstSessionStart: Moment, canTeach: boolean) => React.ReactNode
	= (s, instance, firstSessionStart, canTeach) => {
		const focused = instance.instanceId == focusedInstanceId;
		const {text, bg} = (function() {
			switch (availability(instance, firstSessionStart, canTeach)) {
				case AvailabilityState.CLASS_ENDED:
					return {
						text: "#666666",
						bg: "#C4C4C4"
					}
				case AvailabilityState.AM_TEACHING:
					return {
						text: "#008A00",
						bg: "#8AFF8A"
					}
				case AvailabilityState.CANNOT_TEACH:
					return {
						text: "#DD0000",
						bg: "#FF9999"
					}
				case AvailabilityState.SOMEONE_ELSE_TEACHING:
					return {
						text: "#884411",
						bg: "#F1B98E"
					}
				case AvailabilityState.AVAILABLE:
					return {
						text: "#3377DD",
						bg: "#BED3F4"
					}
			}
		}());

		const time = s.sessionStartMoment.format("h:mmA")

		const instanceInfo = instructorInfoHash[s.instanceId];
		const belowMin = (
			instanceInfo.signupCt < instanceInfo.signupMin.getOrElse(0)
			? "*"
			: ""
		)

		return <span id={`S_${s.sessionId}_I_${s.instanceId}`} style={{
			color: text,
			backgroundColor: focused ? bg : undefined,
			fontWeight: focused ? "bold" : undefined,
			fontSize: focused ? "1.1em" : undefined
		}}>
			{`${time} - ${s.isContinuation ? "(Cont.) " : ""}${s.typeName}`}
			{(
				instanceInfo.instructorName.isSome()
				? <><br />&nbsp;&nbsp;-- {instanceInfo.instructorName.getOrElse("")} ({instanceInfo.signupCt}{belowMin}/{instanceInfo.signupMax.map(String).getOrElse("-")})</>
				: null
			)}
			
		</span>;
	}

	const calendarDayElements: () => CalendarDayElement[] = () => {
		const typeAvailabilities = props.availabilities.types.reduce((hash, type) => {
			hash[String(type.typeId)] = type.availabilityFlag;
			return hash;
		}, {} as {[K: string] : number});

		const typesToShow = selectedClasses.eligibleClasses.concat(selectedClasses.ineligibleClasses)
		.reduce((hash, typeId) => {
			hash[typeId] = true;
			return hash;
		}, {} as {[K: string]: true});

		const sessionsList = props.instances
		.filter(i => typesToShow[String(i.typeId)])
		.flatMap(instance => {
			return instance.sessions.map((session, i) => {
				const startMoment = moment(session.sessionDatetime, "YYYY-MM-DD HH:mm:ss");
				const sessionObj: SessionObject = {
					instanceId: instance.instanceId,
					sessionId: session.sessionId,
					typeName: instance.typeName,
					isContinuation: (i > 0),
					sessionStartString: session.sessionDatetime,
					sessionStartMoment: startMoment,
					sessionStartDayString: Calendar.momentToDayString(startMoment),
					signupType: instance.signupType,
					waitlistResult: instance.waitlistResult,
					availabilityFlag: typeAvailabilities[String(instance.typeId)],
					canTeach: canTeachHash[String(instance.typeId)],
					instructorId: instance.instructorId
				};
				return {
					...sessionObj,
					display: getDisplayForSession(sessionObj, instance, moment(instance.sessions[0].sessionDatetime, "YYYY-MM-DD HH:mm:ss"), canTeachHash[String(instance.typeId)])
				}
			})
		});

		const groupedByDay = _.groupBy(sessionsList, s => s.sessionStartDayString);

		return _.keys(groupedByDay).map(date => ({
			dayMoment: Calendar.dayStringToMoment(date),
			elements: groupedByDay[date].map(e => ({
				id: e.sessionId,
				display: e.display,
				onClick: () => setFocusedInstanceId(e.instanceId)
			}))
		}));
	}

	function instanceDiv() {
		if (focusedInstanceId == null) return null;

		const instance = props.instances.find(e => e.instanceId == focusedInstanceId)
		const datetimeMoment = moment(instance.sessions[0].sessionDatetime, "YYYY-MM-DD HH:mm:ss");

		const instanceContent = (function() {
			switch (availability(instance, datetimeMoment, canTeachHash[String(instance.typeId)])) {
				case AvailabilityState.CLASS_ENDED:
					return "This class has already taken place."
				case AvailabilityState.AM_TEACHING:
					return <>
						You are currently scheduled to teach this class.
						<br /><br />
						<FactaButton text="Cancel as Instructor" onClick={() => {
							if (confirm("Are you sure you want to CANCEL teaching this class?")) {
								return cancelTeach.send(makePostJSON({
									instanceId: focusedInstanceId
								})).then(res => {
									if (res.type == "Success") {
										props.history.push("/redirect" + apPathClassesTeach.getPathFromArgs({}));
									} else {
										window.scrollTo(0, 0);
										setValidationErrors(res.message.split("\\n"))
									}
								})
							} else return Promise.resolve()
						}}/>
					</>
				case AvailabilityState.CANNOT_TEACH:
					return "You are not yet certified to teach this class."
				case AvailabilityState.SOMEONE_ELSE_TEACHING:
					return "Another instructor is scheduled to teach this class."
				case AvailabilityState.AVAILABLE:
					return <>
					This class does not yet have a scheduled instructor.
					<br /><br />
					<FactaButton text="Sign up as Instructor" onClick={() => {
						if (confirm("Are you sure you want to teach this class? Please DOUBLE CHECK the class date/time: " + datetimeMoment.format("MM/DD/YYYY hh:mmA"))) {
							return attemptTeach.send(makePostJSON({
								instanceId: focusedInstanceId
							})).then(res => {
								if (res.type == "Success") {
									props.history.push("/redirect" + apPathClassesTeach.getPathFromArgs({}));
								} else {
									window.scrollTo(0, 0);
									setValidationErrors(res.message.split("\\n"))
								}
							})
						} else return Promise.resolve()
					}}/>
				</>
			}
		}());

		return <FactaArticleRegion title={`${instance.typeName} - ${datetimeMoment.format("dddd MMMM Do, h:mmA")}`} id="focus">
			{instanceContent}
		</FactaArticleRegion>
	}
	function getFilterCell(canTeach: boolean): React.ReactNode{
		const title = canTeach ? "Eligible Classes" : "Ineligible Classes"
		const id: keyof Form = canTeach ? "eligibleClasses" : "ineligibleClasses"
		return (<td style={{verticalAlign: "top", paddingLeft: "10px"}}>
			{title}
			<br />
			<table><tbody>
				<FormCheckbox
					id={id}
					columns={1}
					values={props.availabilities.types.filter(t => t.canTeach == canTeach).map(t => ({key: String(t.typeId), display: t.typeName}))}
					updateAction={(id: string, value: string) => {
						setSelectedClasses({
							...selectedClasses,
							[id]: value
						})
					}}
					value={some(selectedClasses[id])}
				/>
			</tbody></table>
		</td>)
	}

	const filterTable = (<table cellSpacing={40}><tbody><tr>
		{getFilterCell(true)}
		{getFilterCell(false)}
	</tr></tbody></table>)

	return <FactaMainPage setBGImage={setAPImage}>
		{errorPopup}
		<FactaArticleRegion title="AP Class Calendar">
			<Calendar
				monthStartOnDate={0}
				today={getNow()}
				days={calendarDayElements()}
				showElementsInAdjacentMonths={false}
			/>
			<FactaButton text="< Back" onClick={() => Promise.resolve(props.history.push(apBasePath.getPathFromArgs({})))}/>
			<FactaHideShowRegion title="Filter Calendar">
				{filterTable}
			</FactaHideShowRegion>
		</FactaArticleRegion>
		{instanceDiv()}
	</FactaMainPage>
}