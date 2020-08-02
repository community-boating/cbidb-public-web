import * as React from "react";
import * as t from 'io-ts';
import { setAPImage } from "../../util/set-bg-image";
import { apBasePath } from "../../app/paths/ap/_base";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import Button from "../../components/Button";
import {History} from 'history'
import Calendar, { CalendarDayElement } from "../../components/Calendar";
import moment = require('moment');
import { Moment } from 'moment';
import {validator as typesValidator, AvailabilityFlag} from "../../async/member/ap-class-type-avail"
import {resultValidator as classesValidator} from "../../async/member/ap-classes-for-calendar"
import * as _ from 'lodash'
import getNow from "../../util/getNow";
import { Option, none, some } from "fp-ts/lib/Option";
import JoomlaHideShowRegion from "../../theme/joomla/JoomlaHideShowRegion";
import { CheckboxGroup } from "../../components/InputGroup";
import formUpdateState from "../../util/form-update-state";
import optionify from "../../util/optionify"
import {postWrapper as signup} from "../../async/member/ap-class-signup"
import {postWrapper as unenroll} from "../../async/member/ap-class-unenroll"
import { makePostJSON } from "../../core/APIWrapperUtil";
import { apPathClasses } from "../../app/paths/ap/classes";
import FactaMainPage from "../../theme/facta/FactaMainPage";

declare var ddrivetip: any;
declare var hideddrivetip: any;

function resizeRatings(){
	var heightPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('height');
	var height = Number(heightPx.substring(0,heightPx.length-2));
  
	var widthPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('width');
	var width = Number(widthPx.substring(0,widthPx.length-2));
  
	document.getElementById('dhtmltooltip').style.width = width+"px";
	document.getElementById('dhtmltooltip').style.height = height+"px";
}

const tooltipText = `<table style="font-size:1.1em;"><tr><td>
<span style="font-weight:bold; color:#3377DD;">Recommended Class</span><br><span style="font-weight:bold; color:#884411;">Review Class</span><br>
<span style="font-weight:bold; color:#DD0000">Ineligible Class</span><br><br><span style="font-weight:bold; color:#666666;">Class has already taken place</span><br>
<span style="font-weight:bold; color:#008A00;">You are enrolled in this class</span><br>
<span style="font-weight:bold; color:#CC8800;">You are waitlisted in this class</span><br>
<span style="font-weight:bold; color:#B300B3;">A spot is being held for you for up to 20min<br>while you complete the purchase process</span><br>
</td></tr></table>`

type Form = {
	recommendedClasses: Option<string[]>
	reviewClasses: Option<string[]>
	ineligibleClasses: Option<string[]>
}

type Props = {
	history: History<any>,
	types: t.TypeOf<typeof typesValidator>,
	instances: t.TypeOf<typeof classesValidator>
}

type State = {
	formData: Form,
	focusedInstance: Option<number>
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
	availabilityFlag: number
}

class FormCheckbox extends CheckboxGroup<Form>{}

export default class ApClassPage extends React.PureComponent<Props, State> {
	private calendarDayElements(): CalendarDayElement[] {
		const typeAvailabilities = this.props.types.reduce((hash, type) => {
			hash[String(type.typeId)] = type.availabilityFlag;
			return hash;
		}, {} as {[K: string] : number});

		const typesToShow = this.state.formData.recommendedClasses.getOrElse([])
		.concat(this.state.formData.reviewClasses.getOrElse([]))
		.concat(this.state.formData.ineligibleClasses.getOrElse([]))
		.reduce((hash, typeId) => {
			hash[typeId] = true;
			return hash;
		}, {} as {[K: string]: true});

		console.log(typesToShow)

		const sessionsList = this.props.instances
		.filter(i => typesToShow[String(i.typeId)] && i.price <= 0)
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
					display: this.getDisplayForSession(sessionObj)
				}
			})
		});

		const groupedByDay = _.groupBy(sessionsList, s => s.sessionStartDayString);
		console.log(sessionsList.length)
		const focusInstance = (instanceId: number) => () => {
			this.setState({
				...this.state,
				focusedInstance: some(instanceId)
			})
		}
		return _.keys(groupedByDay).map(date => ({
			dayMoment: Calendar.dayStringToMoment(date),
			elements: groupedByDay[date].map(e => ({
				id: e.sessionId,
				display: e.display,
				onClick: focusInstance(e.instanceId)
			}))
		}));
	}
	getDisplayForSession(s: SessionObject): React.ReactNode {
		const now = getNow();
		const focused = s.instanceId == this.state.focusedInstance.getOrElse(-1);
		const {text, bg} = (function() {
			if (now.isAfter(s.sessionStartMoment)) {
				return {
					text: "#666666",
					bg: "#C4C4C4"
				}
			} else if (s.signupType.getOrElse("") == "E") {
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
			} else {
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
	constructor(props: Props) {
		super(props);

		this.state = {
			formData: {
				recommendedClasses: some(this.props.types.filter(t => t.availabilityFlag == AvailabilityFlag.RECOMMENDED).map(t => String(t.typeId))),
				reviewClasses: none,
				ineligibleClasses: none
			},
			focusedInstance: none
		}
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		function getFilterCell(status: AvailabilityFlag): React.ReactNode{
			const title = (function() {
				switch (status) {
				case AvailabilityFlag.RECOMMENDED:
					return "Recommended Classes:";
				case AvailabilityFlag.REVIEW:
					return "Review Classes:";
				case AvailabilityFlag.INELIGIBLE:
					return "Ineligible Classes:";
				}
			}());
			const id: keyof Form = (function() {
				switch (status) {
				case AvailabilityFlag.RECOMMENDED:
					return "recommendedClasses";
				case AvailabilityFlag.REVIEW:
					return "reviewClasses";
				case AvailabilityFlag.INELIGIBLE:
					return "ineligibleClasses";
				}
			}());
			return (<td style={{verticalAlign: "top"}}>
				{title}
				<br />
				<table><tbody>
					<FormCheckbox
						id={id}
						columns={1}
						values={self.props.types.filter(t => t.availabilityFlag == status).map(t => ({key: String(t.typeId), display: t.typeName}))}
						updateAction={(id: string, value: string) => {
							console.log("hi")
							updateState(id, value)
						}}
						value={self.state.formData[id]}
					/>
				</tbody></table>
			</td>)
		}
		function getFocusRegion() {
			return self.state.focusedInstance.chain(instanceId => {
				return optionify(self.props.instances.find(e => e.instanceId == instanceId));
			}).map(i => {
				const datetimeMoment = moment(i.sessions[0].sessionDatetime, "YYYY-MM-DD HH:mm:ss");
				const classType = self.props.types.find(t => t.typeId == i.typeId);
				const description = classType.description;
				const noSignup = classType.noSignup;
				const doSignup = (doWaitlist: boolean) => signup.send(makePostJSON({
					instanceId: i.instanceId,
					doWaitlist
				})).then(res => {
					if (res.type == "Success") {
						self.props.history.push("/redirect" + apPathClasses.getPathFromArgs({}))
					}
				});
				const doUnenroll = () => unenroll.send(makePostJSON({
					instanceId: i.instanceId
				})).then(res => {
					if (res.type == "Success") {
						self.props.history.push("/redirect" + apPathClasses.getPathFromArgs({}))
					}
				});
				const multiSessionText = (
					i.sessions.length > 1
					? <React.Fragment>
						<br />
						<br />
						<b>This class takes place over {i.sessions.length} sessions:</b>
						<br />
						<ul>
						{i.sessions.map((s, index) => <li key={"session_" + index}>{
							moment(s.sessionDatetime, "YYYY-MM-DD HH:mm:ss").format("dddd MMMM Do, h:mmA")
						}</li>)}
						</ul>
					</React.Fragment>
					: null
				);
				const actionText = (function() {
					if (datetimeMoment.isBefore(getNow())) {
						return <span style={{fontWeight: "bold", fontStyle: "italic"}}>This class has already taken place.</span>;
					} else if (i.signupType.getOrElse("") == "E") {
						return <span style={{fontWeight: "bold", fontStyle: "italic"}}>You are enrolled in this class, <a href="#" onClick={e => {
							e.preventDefault();
							doUnenroll();
						}}>click here to unenroll</a>.</span>;
					} else if (i.signupType.getOrElse("") == "W") {
						if (i.waitlistResult.getOrElse("") == "P") {
							return <React.Fragment>
								<b>A spot has opened!</b>
								<br /><br />
								<ul>
									<li><a href="#" onClick={e => {
										e.preventDefault();
										doSignup(false);
									}}>Click here to enroll.</a></li>
									<li><a href="#" onClick={e => {
							e.preventDefault();
							doUnenroll();
						}}>Click here to delist.</a></li>
								</ul>
							</React.Fragment>
						} else {
							return <b>You are currently waitlisted in this class.  <a href="#" onClick={e => {
								e.preventDefault();
								doUnenroll();
							}}>Click here to delist.</a></b>
						}
					} else if (noSignup) {
						return <b>No signup is required for {classType.typeName} classes; simply show up at class time.  There is no limit on class size.</b>
					} else if (classType.seeTypeError.isSome()) {
						return <b>{classType.seeTypeError.getOrElse("")}</b>;
					} else if (i.seeInstanceError.isSome()) {
						return <b>{i.seeInstanceError.getOrElse("")}</b>;
					} else if (i.spotsLeft <= 0) {
						return <b>The class is currently full; <a href="#" onClick={e => {
							e.preventDefault();
							doSignup(true);
						}}>click here to join the wait list.</a></b>;
					} else if (i.price <= 0) {
						return <b>This class is free; <a href="#" onClick={e => {
							e.preventDefault();
							doSignup(false);
						}}>click here to signup!</a></b>
					} else return null;
				}());
				return <JoomlaArticleRegion title={`${i.typeName} - ${datetimeMoment.format("dddd MMMM Do, h:mmA")}`} id="focus">
					{description}
					{multiSessionText}
					<br />
					<br />
					{actionText}
				</JoomlaArticleRegion>
			})
		}
		const filterTable = (<table cellSpacing={40} style={{marginTop: "-40px"}}><tbody><tr>
			{getFilterCell(AvailabilityFlag.RECOMMENDED)}
			{getFilterCell(AvailabilityFlag.REVIEW)}
			{getFilterCell(AvailabilityFlag.INELIGIBLE)}
		</tr></tbody></table>)
		const elements = this.calendarDayElements();
		console.log("about to call calendar with # days: ", elements.length)
		return <FactaMainPage setBGImage={setAPImage}>
			<JoomlaArticleRegion title="AP Class Calendar">
				<Calendar
					monthStartOnDate={0}
					today={getNow()}
					days={elements}
					showElementsInAdjacentMonths={false}
				/>
				<span
					onMouseOver={() => {ddrivetip(tooltipText,'lightYellow',300); resizeRatings();}}
					onMouseOut={() => hideddrivetip()}
				>Hover for Legend</span>
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push(apBasePath.getPathFromArgs({})))}/>
			<JoomlaHideShowRegion title="Filter Calendar">
				{filterTable}
			</JoomlaHideShowRegion>
			{getFocusRegion().getOrElse(null)}
		</FactaMainPage>
	}
}
