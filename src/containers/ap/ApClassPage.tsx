import * as React from "react";
import * as t from 'io-ts';
import { setAPImage } from "util/set-bg-image";
import { apBasePath } from "app/paths/ap/_base";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaButton from "theme/facta/FactaButton";
import {History} from 'history'
import Calendar, { CalendarDayElement } from "components/Calendar";
import * as moment from 'moment';
import { Moment } from 'moment';
import {validator as typesValidator, AvailabilityFlag} from "async/member/ap-class-type-avail"
import * as _ from 'lodash'
import getNow from "util/getNow";
import { Option, none, some } from "fp-ts/lib/Option";
import { CheckboxGroup } from "components/InputGroup";
import formUpdateState from "util/form-update-state";
import optionify from "util/optionify"
import {postWrapper as signup} from "async/member/ap-class-signup"
import {postWrapper as unenroll} from "async/member/ap-class-unenroll"
import { makePostJSON } from "core/APIWrapperUtil";
import { apPathClasses } from "app/paths/ap/classes";
import FactaMainPage from "theme/facta/FactaMainPage";
import { FactaHideShowRegion } from "theme/facta/FactaHideShowRegion";
import { Link } from "react-router-dom";
import { FactaErrorDiv } from "theme/facta/FactaErrorDiv";
import { instancesValidator } from "async/member/ap-classes-for-calendar";
import { validator as welcomeAPValidator } from "async/member-welcome-ap"

declare var ddrivetip: any;
declare var hideddrivetip: any;

function resizeRatings(){
	var heightPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('height');
	var height = Number(heightPx.substring(0,heightPx.length-2))+10;
  
	var widthPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('width');
	var width = Number(widthPx.substring(0,widthPx.length-2))+10;
  
	document.getElementById('dhtmltooltip').style.width = width+"px";
	document.getElementById('dhtmltooltip').style.height = height+"px";
}

const tooltipText = `<table style="font-size:0.8em;"><tr><td>
<span style="font-weight:bold; color:#3377DD;">Recommended Class</span><br><span style="font-weight:bold; color:#884411;">Review Class</span><br>
<span style="font-weight:bold; color:#DD0000">Ineligible Class</span><br><br><span style="font-weight:bold; color:#666666;">Class has already taken place</span><br>
<span style="font-weight:bold; color:#008A00;">You are enrolled in this class</span><br>
<span style="font-weight:bold; color:#CC8800;">You are waitlisted in this class</span><br>
<span style="font-weight:bold; color:#B300B3; white-space:nowrap;">A spot is being held for you for up to 20 min<br>while you complete the purchase process</span><br>
</td></tr></table>`

type Form = {
	recommendedClasses: Option<string[]>
	reviewClasses: Option<string[]>
	ineligibleClasses: Option<string[]>
}

type Props = {
	history: History<any>,
	availabilities: t.TypeOf<typeof typesValidator>,
	instances: t.TypeOf<typeof instancesValidator>,
	welcomeAP: t.TypeOf<typeof welcomeAPValidator>
}

type State = {
	formData: Form,
	focusedInstance: Option<number>,
	validationErrors: string[],
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
		const typeAvailabilities = this.props.availabilities.types.reduce((hash, type) => {
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

		const sessionsList = this.props.instances
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
					display: this.getDisplayForSession(sessionObj)
				}
			})
		});

		const groupedByDay = _.groupBy(sessionsList, s => s.sessionStartDayString);
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
				recommendedClasses: some(this.props.availabilities.types.filter(t => t.availabilityFlag == AvailabilityFlag.RECOMMENDED).map(t => String(t.typeId))),
				reviewClasses: none,
				ineligibleClasses: none
			},
			focusedInstance: none,
			validationErrors: []
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
						values={self.props.availabilities.types.filter(t => t.availabilityFlag == status).map(t => ({key: String(t.typeId), display: t.typeName}))}
						updateAction={(id: string, value: string) => {
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
				const classType = self.props.availabilities.types.find(t => t.typeId == i.typeId);
				const description = classType.description.getOrElse("");
				const noSignup = classType.noSignup;
				const doSignup = (doWaitlist: boolean, navToHome?: boolean) => signup.send(makePostJSON({
					instanceId: i.instanceId,
					doWaitlist
				})).then(res => {
					if (res.type == "Success") {
						if (navToHome) {
							self.props.history.push(apBasePath.getPathFromArgs({}));
						} else {
							self.props.history.push("/redirect" + apPathClasses.getPathFromArgs({}));
						}
					} else {
						window.scrollTo(0, 0);
						self.setState({
							...self.state,
							validationErrors: res.message.split("\\n")
						});
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
						const voucherText = (
							i.price <= 0
							? ""
							: " Credit is transferrable to another paid class up to 48 hours before class start time."
						);
						return <span style={{fontWeight: "bold", fontStyle: "italic"}}>You are enrolled in this class, <a href="#" onClick={e => {
							e.preventDefault();
							doUnenroll();
						}}>click here to unenroll</a>.{voucherText}</span>;
					} else if (i.signupType.getOrElse("") == "W") {
						if (i.waitlistResult.getOrElse("") == "P") {
							return <React.Fragment>
								<b>A spot has opened!</b>
								<br /><br />
								<ul>
									<li>{(function() {
										if (i.price <= 0 || self.props.availabilities.voucherCt > 0) {
											return <a href="#" onClick={e => {
												e.preventDefault();
												doSignup(false);
											}}>Click here to enroll.</a>
										} else {
											return <React.Fragment><a href="#" onClick={e => {
												e.preventDefault();
												doSignup(false, true);
											}}>Click here to enroll</a>.  This is a paid class;
											a spot will be held for you for 20 minutes while you complete the purchase process.
											</ React.Fragment>
										}
									}())}</li>
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
					} else if (i.signupType.getOrElse("") == "P") {
						return <React.Fragment>
							<b>A spot is being held for you while you complete this purchase.</b><br /><br />
							<ul><li><Link to={apBasePath.getPathFromArgs({})}>Click here to return to the homepage to checkout.</Link></li>
							<li><a href="#" onClick={e => {
								e.preventDefault();
								doUnenroll(); // TODO: Is this ok? Not how 610 does it
							}}>Click here to cancel your pending signup.</a></li></ul>
						</React.Fragment>
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
					} else if (i.instructorId.isSome() && i.instructorId.value == self.props.welcomeAP.personId) {
						return <b>You are already signed up to instruct this guided sail session.</b>
					} else if (i.price <= 0) {
						return <b>This class is free; <a href="#" onClick={e => {
							e.preventDefault();
							doSignup(false);
						}}>click here to signup!</a></b>
					} else {
						// paid
						if (self.props.availabilities.voucherCt > 0) {
							return <b>This is a paid class, however your account has {self.props.availabilities.voucherCt} class credit(s); <a href="#" onClick={e => {
								e.preventDefault();
								doSignup(false);
							}}>click here to signup.</a></b>
						} else {
							return <b>This is a paid class; <a href="#" onClick={e => {
								e.preventDefault();
								doSignup(false, true);
							}}>click here to add to add to your cart</a>.  Your seat will be held for up to 20 minutes while you complete the purchase process.
							Credit is transferable to another paid class up to 48 hours before class start time.
							This voucher expires at the end of the current season on October 31st.</b>
						}
					};
				}());
				return <FactaArticleRegion title={`${i.typeName} - ${datetimeMoment.format("dddd MMMM Do, h:mmA")}`} id="focus">
					{<span dangerouslySetInnerHTML={{__html: description}}></span>}
					{multiSessionText}
					<br />
					<br />
					{actionText}
				</FactaArticleRegion>
			})
		}
		const filterTable = (<table cellSpacing={40}><tbody><tr>
			{getFilterCell(AvailabilityFlag.RECOMMENDED)}
			{getFilterCell(AvailabilityFlag.REVIEW)}
			{getFilterCell(AvailabilityFlag.INELIGIBLE)}
		</tr></tbody></table>)
		const elements = this.calendarDayElements();
		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);
		return <FactaMainPage setBGImage={setAPImage}>
			{errorPopup}
			<FactaArticleRegion title="AP Class Calendar">
				<Calendar
					monthStartOnDate={0}
					today={getNow()}
					days={elements}
					showElementsInAdjacentMonths={false}
				/>
				<span
					onMouseOver={() => {ddrivetip(tooltipText,'lightYellow',320); resizeRatings();}}
					onMouseOut={() => hideddrivetip()}
				>Hover for Legend</span>
			</FactaArticleRegion>
			<div style={{marginBottom: "20px"}}><FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(apBasePath.getPathFromArgs({})))}/></div>
			<FactaHideShowRegion title="Filter Calendar">
				{filterTable}
			</FactaHideShowRegion>
			{getFocusRegion().getOrElse(null)}
		</FactaMainPage>
	}
}
