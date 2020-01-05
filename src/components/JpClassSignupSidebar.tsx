import * as React from 'react';
import JoomlaSidebarRegion from "../theme/joomla/JoomlaSidebarRegion";
import { GetSignupsAPIResult, EnrollmentAPIResult, WaitListTopAPIResult, WaitListAPIResult } from '../async/junior/get-signups';
import { postWrapper as doSignup } from "../async/junior/class-signup"
import { postWrapper as deleteSignup } from "../async/junior/class-signup-delete"
import APIWrapper, { PostJSON } from '../core/APIWrapper';
import { History } from 'history';
import * as moment from 'moment';
import { paths } from '../app/routing';
import { Link } from 'react-router-dom';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_IntermediateSailing } from '../lov/magicStrings';

function resizeRatings(){
	var heightPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('height');
	var height = Number(heightPx.substring(0,heightPx.length-2));
  
	var widthPx = window.getComputedStyle(document.getElementById('dhtmltooltip').getElementsByTagName('table')[0]).getPropertyValue('width');
	var width = Number(widthPx.substring(0,widthPx.length-2));
  
	document.getElementById('dhtmltooltip').style.width = width+"px";
	document.getElementById('dhtmltooltip').style.height = height+"px";
}

const getSignupNoteURL = (personId: number, instanceId: number) => 
	paths.signupNote.path
	.replace(":personId", String(personId))
	.replace(":instanceId", String(instanceId));

const showSignupNote = (typeId: number) => typeId == jpClassTypeId_BeginnerSailing || typeId == jpClassTypeId_IntermediateSailing;
const signupNoteMaybe = (typeId: number, juniorId: number, instanceId: number) => (
	showSignupNote(typeId)
	? <React.Fragment>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Link to={getSignupNoteURL(juniorId, instanceId)}>Signup Note</Link></React.Fragment>
	: null
)

declare var ddrivetip: any;
declare var hideddrivetip: any;

const wlTopTooltip = `<table style="font-size:1.1em;"><tr><td>
A seat in the class has opened and you are next in line!  Click "Join the class" to enroll, or "Delist" if you are no longer interested (choosing "Delist" will permanently remove you from the wait list).  If this class conflicts with any others you are already signed up for, you will be prompted to unenroll from each of them before continuing.<br />
<br />
In the interest of making sure all our classes are filled, your wait list offer is valid only until the time and date specified.  If you are unable to respond before then, your place in line will be preserved but you are no longer guaranteed a seat in the class.  If you accept the offer after it has expired, you must still wait for the next available seat to open, and you will be required to reaffirm your interest.

</td></tr></table>`;

const wlTooltip = `<table style="font-size:1.1em;"><tr><td>
When a spot becomes available you will be notified at the email address you use to log into this account.  In the interest of making sure all our classes are filled, you will only have 48 hours to respond before the offer expires (sooner if the seat opens during the weekend before the class begins) so be sure to check your email and/or check back to this page.  The Front Office will also attempt to reach you by phone at the phone number listed on your account.<br />
<br />
If the offer expires before you are able to respond, the open seat will be offered to the next Junior on the wait list, but your place in line will not be lost.  At any time you can reaffirm that you are still interested, and the next available seat will be offered to you.
</td></tr></table>`;

const wlExpiredTooltip = `<table style="font-size:1.1em;"><tr><td>

A seat in the class opened for you, but you were not able to respond in time.  In the interest of making sure all our classes are filled, wait list offers are only valid for a short time before they expire and we attempt to contact other Juniors.<br />
<br />
If you would still like to join the class, your position in line has not been lost.  While your original seat has been offered to someone else, if you click "Take next seat" then the next seat in the class that becomes available will be offered to you.  You will be asked again to reaffirm your interest and availability when another seat becomes available to you.

</td></tr></table>`;

export default (props: {
	signups: GetSignupsAPIResult,
	history: History<any>,
	setValidationErrors: (errors: string[]) => void
}) => {
	function makeAction(apiw: APIWrapper<any, any, any>, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, payload: any){
		e.preventDefault();
		return apiw.send(PostJSON(payload)).then(ret => {
			if (ret.type == "Success") {
				props.history.push(`/redirect${window.location.pathname}`)
			} else {
				window.scrollTo(0, 0);
				props.setValidationErrors(ret.message.split("\\n") );
			}
		});
	}

	function printEnrollments(es: EnrollmentAPIResult[]) {
		if (es.length == 0) {
			return (<div>
				<span className="nodatafound">As you sign up for classes, they will appear in this box!</span>
			</div>);
		} else {
			return (<div><table style={{width: "100%"}} cellPadding="10"><tbody>
				{es.map(e => (<tr key={e.instanceId}><td>
					<b>{e.className}</b><br />
					{e.week}<br />
					{e.dateString}<br />
					{e.timeString}<br />
					<a href="#" onClick={ev => {
						ev.preventDefault();
						if (confirm("Are you sure you want to unenroll from this class?  Your seat will be permanently lost and this cannot be undone.")) {
							makeAction(deleteSignup, ev, {
								juniorId: props.signups.juniorId,
								instanceId: e.instanceId
							});
						}
					}}>Unenroll</a>{signupNoteMaybe(e.typeId, props.signups.juniorId, e.instanceId)}
				</td></tr>))}
			</tbody></table></div>	);
		}
	}

	function printWLTop(t: WaitListTopAPIResult) {
		const expires = moment(t.offerExpDatetime);
		const now = moment(t.nowDateTime);
		const isExpired = expires.isBefore(now);
		if (isExpired) {
			return (<tr><td style={{backgroundColor: "#eef"}}>
				<b>Beginner Sailing</b><br />
				Week 6<br />
				Jul 22nd - Aug 02nd<br />
				12:00PM - 03:00PM  Mon - Fri &nbsp;<br />
				<a href="#" onClick={e => makeAction(doSignup, e, {
					doEnroll: false,
					juniorId: props.signups.juniorId,
					instanceId: t.instanceId
				})}>Take Next Seat</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick={ev => {
					ev.preventDefault();
					if (confirm("Are you sure you want to leave this wait list?  Your place in line will be permanently lost and this cannot be undone.")) {
						makeAction(deleteSignup, ev, {
							juniorId: props.signups.juniorId,
							instanceId: t.instanceId
						});
					}
				}}>Delist</a><br />
				<i>This offer already expired,<br />
				but you can still take<br />
				the next available spot.</i><br />
				<span
					style={{color: "#2358A6", cursor: "help"}}
					onMouseOver={() => {ddrivetip(wlExpiredTooltip,'lightYellow',300); resizeRatings();}}
					onMouseOut={() => hideddrivetip()}
				>What does this mean?</span>
			</td></tr>);
		} else {
			return (<tr key={t.instanceId}><td style={{backgroundColor: "#eef"}}>
			* Spot Available! *<br />
			<b>{t.className}</b><br />
			{t.week}<br />
			{t.dateString}<br />
			{t.timeString}<br />
			<i>Offer expires {t.offerExpiresString}</i><br />
			<a href="#" onClick={e => makeAction(doSignup, e, {
				doEnroll: true,
				juniorId: props.signups.juniorId,
				instanceId: t.instanceId
			})}>Join the Class</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onClick={ev => {
				ev.preventDefault();
				if (confirm("Are you sure you want to leave this wait list?  Your place in line will be permanently lost and this cannot be undone.")) {
					makeAction(deleteSignup, ev, {
						juniorId: props.signups.juniorId,
						instanceId: t.instanceId
					});
				}
			}}>Delist</a><br />
			<span
				style={{color: "#2358A6", cursor: "help"}}
				onMouseOver={() => {ddrivetip(wlTopTooltip,'lightYellow',300); resizeRatings();}}
				onMouseOut={() => hideddrivetip()}
			>What does this mean?</span>
		</td></tr>);
		}
	}
	
	const enrolledComponent = (enrollments: EnrollmentAPIResult[]) => (
		<JoomlaSidebarRegion title="Your Signups">
			{printEnrollments(enrollments)}
		</JoomlaSidebarRegion>
	);
	
	const waitListTopComponent = (tops: WaitListTopAPIResult[]) => (
		<JoomlaSidebarRegion title="Top of the Wait List">
			<div><table style={{width: "100%"}} cellPadding="10"><tbody>
				{tops.map(printWLTop)}
			</tbody></table> </div>	
		</JoomlaSidebarRegion>
	);
	
	const waitListComponent = (wls: WaitListAPIResult[]) => (
		<JoomlaSidebarRegion title="Wait Lists">
			<div><table style={{width: "100%"}} cellPadding="10"><tbody>
				{wls.map(wl => (<tr key={wl.instanceId}><td>
					<b>{wl.className}</b><br />
					{wl.week}<br />
					{wl.dateString}<br />
					{wl.timeString}<br />
					<a href="#" onClick={ev => {
						ev.preventDefault();
						if (confirm("Are you sure you want to leave this wait list?  Your place in line will be permanently lost and this cannot be undone.")) {
							makeAction(deleteSignup, ev, {
								juniorId: props.signups.juniorId,
								instanceId: wl.instanceId
							})
						}
					}}>Delist</a>{signupNoteMaybe(wl.typeId, props.signups.juniorId, wl.instanceId)}<br />
					<i>You are in position {wl.wlPosition} in line.</i><br />
					<span
						style={{color: "#2358A6", cursor: "help"}}
						onMouseOver={() => {ddrivetip(wlTooltip,'lightYellow',300); resizeRatings();}}
						onMouseOut={() => hideddrivetip()}
					>How does the wait list work?</span>
				</td></tr>))}
			</tbody></table></div>	
		</JoomlaSidebarRegion>
	);

	return (
		<React.Fragment>
			{enrolledComponent(props.signups.enrollments)}
			{props.signups.waitListTops.length > 0 ? waitListTopComponent(props.signups.waitListTops) : null}
			{props.signups.waitLists.length > 0 ? waitListComponent(props.signups.waitLists) : null}
		</React.Fragment>
	);
}