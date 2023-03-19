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
import {validator as typesValidator, AvailabilityFlag} from "async/member/ap-class-type-avail"
import {resultValidator as classesValidator} from "async/member/ap-classes-for-calendar"
import { Option } from 'fp-ts/lib/Option';

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
	availabilityFlag: number
}

export const ApVolunteerClassPage = (props: {
	history: History,
	availabilities: t.TypeOf<typeof typesValidator>,
	instances: t.TypeOf<typeof classesValidator>
}) => {
	const getDisplayForSession: (s: SessionObject) => React.ReactNode = s => {
		const now = getNow();
		const focused = false // s.instanceId == this.state.focusedInstance.getOrElse(-1);
		const {text, bg} = (function() {
			if (now.isAfter(s.sessionStartMoment)) {
				return {
					text: "#666666",
					bg: "#C4C4C4"
				}
			} /*else if (s.signupType.getOrElse("") == "E") {
				return {
					text: "#008A00",
					bg: "#8AFF8A"
				}
			} else if (s.signupType.getOrElse("") == "P") {
				return {
					text: "#B300B3",
					bg: "#FF99FF"
				}
			} else if (s.signupType.getOrElse("") == "W" && s.waitlistResult.getOrElse("P") != "F") {
				return {
					text: "#CC8800",
					bg: "#FFE6B3"
				}
			} else if (s.availabilityFlag == AvailabilityFlag.INELIGIBLE) {
				return {
					text: "#DD0000",
					bg: "#FF9999"
				}
			} else if (s.availabilityFlag == AvailabilityFlag.REVIEW) {
				return {
					text: "#884411",
					bg: "#F1B98E"
				}
			} */else {
				return {
					text: "#3377DD",
					bg: "#BED3F4"
				}
			}
		}());

		const time = s.sessionStartMoment.format("h:mmA")

		return <span id={`S_${s.sessionId}_I_${s.instanceId}`} style={{
			color: text,
			backgroundColor: focused ? bg : undefined,
			fontWeight: focused ? "bold" : undefined,
			fontSize: focused ? "1.1em" : undefined
		}}>
			{`${time} - ${s.isContinuation ? "(Cont.) " : ""}${s.typeName}`}
		</span>;
	}

	const calendarDayElements: () => CalendarDayElement[] = () => {
		const typeAvailabilities = props.availabilities.types.reduce((hash, type) => {
			hash[String(type.typeId)] = type.availabilityFlag;
			return hash;
		}, {} as {[K: string] : number});

		const typesToShow = props.availabilities.types
		.reduce((hash, t) => {
			hash[t.typeId] = true;
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
					availabilityFlag: typeAvailabilities[String(instance.typeId)]
				};
				return {
					...sessionObj,
					display: getDisplayForSession(sessionObj)
				}
			})
		});

		const groupedByDay = _.groupBy(sessionsList, s => s.sessionStartDayString);
		// const focusInstance = (instanceId: number) => () => {
		// 	this.setState({
		// 		...this.state,
		// 		focusedInstance: some(instanceId)
		// 	})
		// }
		return _.keys(groupedByDay).map(date => ({
			dayMoment: Calendar.dayStringToMoment(date),
			elements: groupedByDay[date].map(e => ({
				id: e.sessionId,
				display: e.display,
				onClick: () => {} //focusInstance(e.instanceId)
			}))
		}));
	}

	return <FactaMainPage setBGImage={setAPImage}>
	{/* {errorPopup} */}
	<FactaArticleRegion title="AP Class Calendar">
		<Calendar
			monthStartOnDate={0}
			today={getNow()}
			days={calendarDayElements()}
			showElementsInAdjacentMonths={false}
		/>
		{/* <span
			onMouseOver={() => {ddrivetip(tooltipText,'lightYellow',320); resizeRatings();}}
			onMouseOut={() => hideddrivetip()}
		>Hover for Legend</span> */}
		<FactaButton text="< Back" onClick={() => Promise.resolve(props.history.push(apBasePath.getPathFromArgs({})))}/>
	</FactaArticleRegion>
</FactaMainPage>
}