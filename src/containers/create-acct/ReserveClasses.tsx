import { Option, none, some, Some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import * as React from "react";
import TextInput from "../../components/TextInput";
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import formUpdateState from '../../util/form-update-state';
import { Select } from '../../components/Select';
import {validator, validatorSingleRow} from "../../async/class-instances-with-avail"
import JoomlaReport from '../../theme/joomla/JoomlaReport';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_IntermediateSailing } from '../../lov/magicStrings';
import { Moment } from 'moment';
import Button from '../../components/Button';
import { PreRegistration, PreRegistrationClass } from '../../app/global-state/jp-pre-registrations';
import asc from '../../app/AppStateContainer';
import optionify from '../../util/optionify';
import {postWrapper as addJuniorPostWrapper} from "../../async/junior/add-junior-class-reservation"
import { getWrapper as getReservations, validator as reservationAPIValidator } from '../../async/junior/get-junior-class-reservations'
import { PostJSON, PostString } from '../../core/APIWrapper';
import { History } from 'history';
import ErrorDiv from '../../theme/joomla/ErrorDiv';
import {postWrapper as deleteJunior} from '../../async/junior/delete-junior-class-reservation'
import moment = require('moment');
import {getWrapper as getClassesWithAvail} from "../../async/class-instances-with-avail"
import { getClassesAndPreregistrations, paths } from '../../app/routing';

export type ClassInstanceObject = t.TypeOf<typeof validatorSingleRow> & {
	startDateMoment: Moment,
	endDateMoment: Moment,
	isMorning: boolean
};

type Props = {
	apiResultStart: ClassInstanceObject[],
	startingPreRegistrations: PreRegistration[],
	history: History<any>,
	noSignupJuniors: string[]
}

const morningAfternoonValues = [
	"Morning",
	"Afternoon"
]

const defaultForm = {
	juniorFirstName: none as Option<string>,
	beginnerMorningAfternoon: some("Morning") as Option<string>,
	intermediateMorningAfternoon: some("Morning") as Option<string>,
	selectedBeginnerInstance: none as Option<string>,
	selectedIntermediateInstance: none as Option<string>
}

const renderClassLine = (preregClass: Option<PreRegistrationClass>) => preregClass.fold(
	"(None)",
	c => c.dateRange + ", " + c.timeRange
)

export const preRegRender = (then: () => void) => (prereg: PreRegistration, i: number) => (<tr key={`prereg_${i}`}><td>
	<b><a href="#" onClick={() => {
		if (window.confirm(`Do you really want to delete the reservations for ${prereg.firstName}?`)) {
			deleteJunior.send(PostString("name=" + prereg.firstName)).then(then)
		}
	}}><img src="/images/delete.png" /></a>{"   " + prereg.firstName}</b><br />
	Beginner:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.beginner)}}></span><br />
	Intermediate:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.intermediate)}}></span><br />
	{function() {
		const classToUse = prereg.beginner.getOrElse(null) || prereg.intermediate.getOrElse(null);
		if (classToUse && classToUse.expirationDateTime && classToUse.minutesRemaining) {
			return (<span style={{fontStyle:"italic"}}>Reservation expires: {classToUse.expirationDateTime.format("hh:mmA")} ({classToUse.minutesRemaining} min)</span>)
		} else return "";
	}()}
</td></tr>);

export type Form = typeof defaultForm

type State = {
	apiResult: ClassInstanceObject[],
	formData: Form,
	preRegistrations: PreRegistration[],
	validationErrors: string[]
}

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

const getClassDate = (classObj: ClassInstanceObject) => `${classObj.startDateMoment.format("MM/DD")}&nbsp;-&nbsp;${classObj.endDateMoment.format("MM/DD")}`;
const getClassTime = (classObj: ClassInstanceObject) => classObj.classTime.replace(/ /g, "&nbsp;");

const wrapInLabel = (statePropName: string, instanceId: string) => (s: string) =>
	<label htmlFor={`sel_${statePropName}_${instanceId}`}><span dangerouslySetInnerHTML={{__html: s as string}}></span></label>

function classReport(statePropName: keyof Form, update: (id: string, value: string) => void, selectedValue: Option<string>, classes: ClassInstanceObject[]) {
	const getRadio = (instanceId: number) => (<input
		type="radio"
		key={`sel_${statePropName}_${instanceId}`}
		id={`sel_${statePropName}_${instanceId}`}
		name={`sel_${statePropName}`}
		value={instanceId}
		onChange={(e) => update(statePropName, e.target.value)}
		checked={instanceId == -1 ? selectedValue.isNone() : selectedValue.getOrElse(null) == String(instanceId)}
	/>);
	const wrapInLabelNone = wrapInLabel(statePropName, "-1")
	const noneRow: React.ReactNode[] = [
		getRadio(-1),
		wrapInLabelNone("NONE"),
		wrapInLabelNone("-"),
		wrapInLabelNone("-"),
		wrapInLabelNone("-")
	]

	return (<JoomlaReport
		headers={["Select", "Class Date", "Class Time", "Spots Left", "Notes"]}
		rows={[noneRow].concat(classes.map(c => {
			const wrapInLabelSpecific = wrapInLabel(statePropName, String(c.instanceId))
			return ([
				getRadio(c.instanceId),
				wrapInLabelSpecific(getClassDate(c)),
				wrapInLabelSpecific(getClassTime(c)),
				wrapInLabelSpecific(
					c.action == "Begun"
					? '<span style="font-weight:bold; color:#777; font-style:italic;">Class has already begun</span>'
					: c.spotsLeft
				),
				wrapInLabelSpecific(c.notes.getOrElse("-"))
			]);
		}))}
		cellStyles={[
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{textAlign: "center"},
			{}
		]}
	/>);
}

// Given the global class instance data and a list of (name, instanceId) pairs, reconstitute the preregistrations prop as {name, beginner, instermediate}[]
export const bundleReservationsFromAPI: (classData: ClassInstanceObject[]) => (reservationRows: t.TypeOf<typeof reservationAPIValidator>) => PreRegistration[] =
classData => reservationRows => {
	// first, map each instanceId to beginner or intermediate. Chuck anything that isn't one of those two classes
	// TODO: should probably throw if we find an unexpected class
	const reservationRowsWithTypeId = reservationRows.instances.map(row => {
		const cio = classData.find(cd => cd.instanceId == row.instanceId)
		if (undefined == cio) return null;
		return {
			...row,
			cio
		}
	}).filter(Boolean) // chuck nulls
	.filter(r => r.cio.typeId == jpClassTypeId_BeginnerSailing || r.cio.typeId == jpClassTypeId_IntermediateSailing) // chuck anything thats not beginner or int

	// next, bundle up per junior
	const mapToPreregistration = (cio: ClassInstanceObject) => ({
		instanceId: cio.instanceId,
		dateRange: getClassDate(cio),
		timeRange: getClassTime(cio)
	});
	const hashByJunior = reservationRowsWithTypeId.reduce((hash, row) => {
		if (!hash[row.juniorFirstName]) {
			hash[row.juniorFirstName] = {
				juniorPersonId: row.juniorPersonId,
				firstName: row.juniorFirstName,
				beginner: none,
				intermediate: none
			}
		}
		if (row.cio.typeId == jpClassTypeId_BeginnerSailing) {
			hash[row.juniorFirstName].beginner = some({
				...mapToPreregistration(row.cio),
				expirationDateTime: moment(row.expirationDateTime, "YYYY-MM-DDTHH:mm:ss"),
				minutesRemaining: row.minutesRemaining,
				signupNote: row.signupNote
			});
		}
		else if (row.cio.typeId == jpClassTypeId_IntermediateSailing) {
			hash[row.juniorFirstName].intermediate = some({
				...mapToPreregistration(row.cio),
				expirationDateTime: moment(row.expirationDateTime, "YYYY-MM-DDTHH:mm:ss"),
				minutesRemaining: row.minutesRemaining,
				signupNote: row.signupNote
			});
		}
		return hash;
	}, {} as {[K: string]: PreRegistration})

	const ret = Object.values(hashByJunior).concat(reservationRows.noSignups.map(j => ({
		juniorPersonId: -1, // TODO: currently no reason this is needed but it sucks to leave it like this
		firstName: j,
		beginner: none,
		intermediate: none
	})));
	return ret;
}

export default class ReserveClasses extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			apiResult: props.apiResultStart,
			formData: defaultForm,
			validationErrors: [],
			preRegistrations: this.props.startingPreRegistrations
		};
	}
	private timeUpdateState = (prop: string, value: string) => {
		const selectedClassFormProp: keyof Form = (prop == "beginnerMorningAfternoon" ? "selectedBeginnerInstance" : "selectedIntermediateInstance");
		let newFormPart = {};
		newFormPart[prop] = some(value);
		newFormPart[selectedClassFormProp] = none
		this.setState({
			...this.state,
			formData: {
				...this.state.formData,
				...newFormPart
			}
		})
	}
	render() {
		const self= this;
		const formData = this.state.formData;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const updateStateWrappedForID = (id: string, value: string) => {
			if ((id == "selectedBeginnerInstance" || id == "selectedIntermediateInstance") && value == "-1") {
				// empty string will be converted to none
				updateState(id as any, "");
			} else {
				updateState(id as any, value);
			}
		}

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const classStarted = (c: ClassInstanceObject) => c.action == "Begun"

		const submitAction = () => {
			const beginner = optionify(self.state.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedBeginnerInstance.getOrElse("-1")));
			const intermediate = optionify(self.state.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedIntermediateInstance.getOrElse("-1")));
			if (self.state.formData.juniorFirstName.getOrElse("").length == 0) {
				this.setState({
					...this.state,
					validationErrors: ["Please provide junior name."]
				})
				return Promise.reject();
			} else if (this.state.preRegistrations.find(p => p.firstName == self.state.formData.juniorFirstName.getOrElse(""))) {
				this.setState({
					...this.state,
					validationErrors: ["There is already a junior by that name.  Please use unique nicknames (it's ok if they are not the real first names for now; you will be able to update them later)."]
				})
				return Promise.reject();
			} else if (beginner.isNone() && intermediate.isNone()) {
				this.setState({
					...this.state,
					validationErrors: ["Please specify class to reserve.  If you do not want to reserve classes at this time, click \"Continue to Registration\" below.  You will have the opportunity to add more juniors later."]
				})
				return Promise.reject();
			} else if (beginner.isNone() && intermediate.isSome()) {
				this.setState({
					...this.state,
					validationErrors: ["You may not sign up for Intermediate Sailing without signing up for a Beginner Sailing as well.  If you are looking for advanced placement, contact the Front Office by emailing info@community-boating.org or calling 617-523-1038."]
				})
				return Promise.reject();
			} else if (beginner.map(classStarted).getOrElse(false) || intermediate.map(classStarted).getOrElse(false)) {
				this.setState({
					...this.state,
					validationErrors: ["That class has already started."]
				})
				return Promise.reject();
			} else {
				return addJuniorPostWrapper.send(PostJSON({
					juniorFirstName: self.state.formData.juniorFirstName.getOrElse(""),
					beginnerInstanceId: beginner.map(c => c.instanceId),
					intermediateInstanceId: intermediate.map(c => c.instanceId)
				})).then(resp => {
					if (resp.type == "Success") {
						// todo: dont add to asc without a protoperson id back from api
						// then, use that ID in the delete call
						this.setState({
							...this.state,
							formData: defaultForm,
							preRegistrations: this.state.preRegistrations.concat([{
								juniorPersonId: resp.success.personId,
								firstName: self.state.formData.juniorFirstName.getOrElse(""),
								beginner: beginner.map(c => ({
									instanceId: c.instanceId,
									dateRange: getClassDate(c),
									timeRange: getClassTime(c),
									signupNote: none
								})),
								intermediate: intermediate.map(c => ({
									instanceId: c.instanceId,
									dateRange: getClassDate(c),
									timeRange: getClassTime(c),
									signupNote: none
								})),
							}]),
							validationErrors: []
						})
						return Promise.resolve(resp.success.personId);
					} else {
						return getClassesAndPreregistrations().then(res => {
							if (res.type == "Success") {
								this.setState({
									...this.state,
									apiResult: res.success.classes,
									validationErrors: [resp.message || "An error has occurred; please try again later.  If this message persists contact the Front Office at 617-523-1038."]
								});
							} else {
								this.setState({
									...this.state,
									validationErrors: [resp.message || "An error has occurred; please try again later.  If this message persists contact the Front Office at 617-523-1038."]
								})
							}							
							return Promise.reject();
						})
					}
					
				}, err => {
					console.log("Error: ", err)
				});
			}
		}

		const main = (<React.Fragment>
			{errorPopup}
			<JoomlaArticleRegion title="Reserve Classes">
				New sailors should take our two-week Beginner Sailing class.
				You may also sign your child up for a two-week Intermediate Sailing class.
				We recommend signing up all new sailors/members for a one-hour Paddling Introduction so they can go paddling when not in class.
				<br />
				<br />
				
				Please note the following important points:<br /><br />
				<ul>
					<li>
						<span style={{color: "#F00", fontWeight: "bold"}}>
							Your class signup is not finalized until registration is complete and payment is processed.
						</span>  Your spots will be held for 2 hours after submitting your first reservation.
					</li>
					<li>
						Other class types are offered; signups are available once payment is processed and registration is complete. 
					</li>
					<li>
						Wait listing in full classes is available once payment is processed and registration is complete.
					</li>
				</ul>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Add a Junior">
				Please enter the name of a junior member you'd like to register, and select any classes you'd like to reserve a spot in. 
				If you have multiple juniors to register, complete this page one at a time, and click "Proceed to Register" on the right when you are finished.
				<br />
				<br />
				<table><tbody><FormInput
					id="juniorFirstName"
					label="Junior First Name"
					value={formData.juniorFirstName}
					updateAction={updateState}
					isRequired
					extraCells={<span style={{color: "#777", fontSize: "0.8em"}}>  (This is just to help you keep track of which class reservations are for which kids; we'll collect full information later)</span>}
				/></tbody></table>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Beginner Sailing">
				<table><tbody><FormSelect
					id="beginnerMorningAfternoon"
					label="Choose a time:  "
					value={formData.beginnerMorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedBeginnerInstance",
					updateStateWrappedForID,
					self.state.formData.selectedBeginnerInstance,
					self.state.apiResult
						.filter(c => c.typeId == jpClassTypeId_BeginnerSailing)
						.filter(c => c.isMorning == (self.state.formData.beginnerMorningAfternoon.getOrElse("") == "Morning"))
				)}
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Intermediate Sailing">
				<table><tbody><FormSelect
					id="intermediateMorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediateMorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedIntermediateInstance",
					updateStateWrappedForID,
					self.state.formData.selectedIntermediateInstance,
					self.state.apiResult
						.filter(c => c.typeId == jpClassTypeId_IntermediateSailing)
						.filter(c => c.isMorning == (self.state.formData.intermediateMorningAfternoon.getOrElse("") == "Morning"))
				)}
			</JoomlaArticleRegion>
			<Button text={<span> &lt; Back</span>} spinnerOnClick={true} onClick={() => Promise.resolve(self.props.history.push("/"))}/>
			<Button text={<span>Create Junior</span>} spinnerOnClick={true} onClick={() => submitAction().then(
				personId =>self.props.history.push(paths.reservationNotes.path.replace(":personId", String(personId))),
				() => window.scrollTo(0, 0)
			)}/>
		</React.Fragment>);

		const sidebar = (<JoomlaSidebarRegion title="Your Juniors"><table><tbody>
			{self.state.preRegistrations.length==0
				? <tr><td>As you reserve classes for more juniors, they will appear in this box.  When you have reserved a class for all your juniors, click the button below!</td></tr>
				: self.state.preRegistrations.map(preRegRender(() => self.props.history.push("/redirect/reserve")))
			}
			<br />
			<Button text={<span>Proceed to Register ></span>} spinnerOnClick={true} onClick={() => Promise.resolve(self.props.history.push("/create-acct"))}/>
			</tbody></table>
			
		</JoomlaSidebarRegion>);

		return <Joomla8_4 main={main} right={sidebar} />
	}
}
