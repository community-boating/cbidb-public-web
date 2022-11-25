import { Option, none, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import * as React from "react";
import TextInput from "components/TextInput";
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import formUpdateState from 'util/form-update-state';
import { Select } from 'components/Select';
import { validatorSingleRow } from "async/class-instances-with-avail"
import StandardReport from 'theme/facta/StandardReport';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_intermediate1, jpClassTypeId_intermediate2} from 'lov/magicStrings';
import { Moment } from 'moment';
import FactaButton from 'theme/facta/FactaButton';
import { PreRegistration, PreRegistrationClass } from 'app/global-state/jp-pre-registrations';
import optionify from 'util/optionify';
import {postWrapper as addJuniorPostWrapper} from "async/junior/add-junior-class-reservation"
import { validator as reservationAPIValidator } from 'async/junior/get-junior-class-reservations'
import { makePostJSON, makePostString } from 'core/APIWrapperUtil';
import { History } from 'history';
import {FactaErrorDiv} from 'theme/facta/FactaErrorDiv';
import {postWrapper as deleteJunior} from 'async/junior/delete-junior-class-reservation'
import * as moment from 'moment';
import getClassesAndPreregistrations from 'async/util/getClassesAndPreregistrations';
import { reserveNotesPageRoute } from 'app/routes/jp/reserve-notes';
import { createAcctPageRoute } from 'app/routes/jp/create-acct';
import { reservePageRoute } from 'app/routes/jp/reserve';
import { setJPImage } from 'util/set-bg-image';
import { jpBasePath } from 'app/paths/jp/_base';
import FactaSidebarPage from 'theme/facta/FactaSidebarPage';
import FactaSidebarRegion from 'theme/facta/FactaSidebarRegion';

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
	intermediate1MorningAfternoon: some("Morning") as Option<string>,
	intermediate2MorningAfternoon: some("Morning") as Option<string>,
	selectedBeginnerInstance: none as Option<string>,
	selectedIntermediate1Instance: none as Option<string>,
	selectedIntermediate2Instance: none as Option<string>
}

const renderClassLine = (preregClass: Option<PreRegistrationClass>) => preregClass.fold(
	"(None)",
	c => c.dateRange + ", " + c.timeRange
)

export const preRegRender = (then: () => void) => (prereg: PreRegistration, i: number) => (<tr key={`prereg_${i}`}><td>
	<b><a href="#" onClick={() => {
		if (window.confirm(`Do you really want to delete the reservations for ${prereg.firstName}?`)) {
			deleteJunior.send(makePostString("name=" + prereg.firstName)).then(then)
		}
	}}><img src="/images/delete.png" /></a>{"   " + prereg.firstName}</b><br />
	Beginner Sailing:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.beginner)}}></span><br />
	Intermediate I:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.intermediate1)}}></span><br />
	Intermediate II:<br /><span dangerouslySetInnerHTML={{__html: renderClassLine(prereg.intermediate2)}}></span><br />
	{function() {
		const classToUse = prereg.beginner.getOrElse(null) || prereg.intermediate1.getOrElse(null) || prereg.intermediate2.getOrElse(null);
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

	return (<StandardReport
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
	.filter(r => r.cio.typeId == jpClassTypeId_BeginnerSailing || r.cio.typeId == jpClassTypeId_intermediate1 || r.cio.typeId == jpClassTypeId_intermediate2) // chuck anything thats not beginner or int

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
				intermediate1: none,
				intermediate2: none
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
		else if (row.cio.typeId == jpClassTypeId_intermediate1) {
			hash[row.juniorFirstName].intermediate1 = some({
				...mapToPreregistration(row.cio),
				expirationDateTime: moment(row.expirationDateTime, "YYYY-MM-DDTHH:mm:ss"),
				minutesRemaining: row.minutesRemaining,
				signupNote: row.signupNote
			});
		}
		else if (row.cio.typeId == jpClassTypeId_intermediate2) {
			hash[row.juniorFirstName].intermediate2 = some({
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
		intermediate1: none,
		intermediate2: none
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
		const selectedClassFormProp: keyof Form = (function() {
			switch (prop) {
			case "beginnerMorningAfternoon":
				return "selectedBeginnerInstance";
			case "intermediate1MorningAfternoon":
				return "selectedIntermediate1Instance";
			case "intermediate2MorningAfternoon":	
				return "selectedIntermediate2Instance";
			}
		}());
		
		let newFormPart: any = {};
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
			if ((id == "selectedBeginnerInstance" || id == "selectedIntermediate1Instance" || id == "selectedIntermediate2Instance") && value == "-1") {
				// empty string will be converted to none
				updateState(id as any, "");
			} else {
				updateState(id as any, value);
			}
		}

		// const capacityWarning = <div className="alert-global alert-top alert-yellow" style={{marginBottom: "15px"}}>
		// 	<div className="row no-gutters">
		// 		<table><tbody><tr>
		// 		<td style={{height: "100%"}}>
		// 			<div style={{padding: "1px 0 0 0", height: "100%"}}>
		// 				<div className="alert-subject">
		// 					<div className="alert-subject-icon"><svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"> <path fillRule="evenodd" clipRule="evenodd" d="M25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50ZM30 15.0845C30 15.9354 29.6753 16.6609 29.0255 17.2585C28.3758 17.856 27.5953 18.1559 26.6804 18.1559C25.7692 18.1559 24.9813 17.856 24.3278 17.2585C23.6781 16.6609 23.3495 15.9354 23.3495 15.0845C23.3495 14.235 23.6781 13.5098 24.3278 12.9067C24.9813 12.3035 25.7692 12 26.6804 12C27.5953 12 28.3758 12.3035 29.0255 12.9067C29.6753 13.5098 30 14.235 30 15.0845ZM28.7118 35.2115C29.3206 35.6777 28.7006 36.697 27.528 37.2393C26.5123 37.7132 25.2577 38.0368 24.3802 38.0368C23.0284 38.0368 21.8746 37.428 21.1238 36.7711C20.3734 36.1161 20 35.2874 20 34.2826C20 33.8903 20.0261 33.4905 20.0821 33.0815C20.1418 32.6728 20.2316 32.212 20.351 31.6976L21.7513 26.8018C21.8784 26.3337 21.9789 25.8879 22.0649 25.4696C22.1471 25.0516 22.1956 24.6647 22.1956 24.3206C22.1956 23.6934 22.0612 23.2586 21.7998 23.0143C21.5384 22.7681 21.0455 22.6444 20.3099 22.6444C19.9478 22.6444 19.5854 21.2379 21.2173 20.6718C22.05 20.3869 22.8453 20.2777 23.5922 20.2777C24.9365 20.2777 25.9745 20.6017 26.699 21.2436C27.4272 21.8875 27.7933 22.7238 27.7933 23.7506C27.7933 23.8692 27.785 24.0392 27.7691 24.2614C27.7567 24.4344 27.7397 24.6392 27.7184 24.8758C27.6663 25.4104 27.5691 25.9027 27.4384 26.3505L26.0456 31.2278C25.9336 31.62 25.829 32.0698 25.7394 32.5728C25.6498 33.0745 25.6087 33.4537 25.6087 33.7126C25.6087 34.3602 25.7506 34.7988 26.0456 35.0356C26.3368 35.2705 26.8448 35.3871 27.5654 35.3871C27.6897 35.3871 27.8309 35.3264 27.9772 35.2634C28.2264 35.1561 28.4906 35.0424 28.7118 35.2115Z" fill="white"></path> </svg></div>
		// 					<div className="alert-subject-content">
		// 						<div className="alert-subject-content-title">Junior Program Classes<br />are Close to Capacity</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</td>	
		// 		<td>
		// 			<div className="col-12 col-lg">
		// 				<div className="alert-body">
		// 				<p>Please read the following before purchasing a Junior Program membership.... <a target="_blank" href="https://www.community-boating.org/blog/junior-program-registration-advisory/">Click here for the Registration Advisory</a></p>
		// 				</div>
		// 			</div>
		// 		</td>
		// 		</tr></tbody></table>
				
				
		// 	</div>
		// </div>;

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const classStarted = (c: ClassInstanceObject) => c.action == "Begun"

		const submitAction = () => {
			const beginner = optionify(self.state.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedBeginnerInstance.getOrElse("-1")));
			const intermediate1 = optionify(self.state.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedIntermediate1Instance.getOrElse("-1")));
			const intermediate2 = optionify(self.state.apiResult.find(c => String(c.instanceId) == self.state.formData.selectedIntermediate2Instance.getOrElse("-1")));
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
			} else if (beginner.isNone() && intermediate1.isNone() && intermediate2.isNone()) {
				this.setState({
					...this.state,
					validationErrors: ["Please specify class to reserve. Experienced sailors and anyone who does not want to reserve a Beginner Class at this time, should contact the JP Director at juniorprogramdirector@community-boating.org for assistance."]
				})
				return Promise.reject();
			} else if (beginner.isNone() && intermediate1.isSome()) {
				this.setState({
					...this.state,
					validationErrors: ["You may not sign up for Intermediate I without signing up for a Beginner Sailing as well.  If you are looking for advanced placement, contact the Front Office by emailing info@community-boating.org or calling 617-523-1038."]
				})
				return Promise.reject();
			} else if (intermediate1.isNone() && intermediate2.isSome()) {
				this.setState({
					...this.state,
					validationErrors: ["You may not sign up for Intermediate II without signing up for Intermediate I as well.  If you are looking for advanced placement, contact the Front Office by emailing info@community-boating.org or calling 617-523-1038."]
				})
				return Promise.reject();
			} else if (beginner.map(classStarted).getOrElse(false) || intermediate1.map(classStarted).getOrElse(false) || intermediate2.map(classStarted).getOrElse(false)) {
				this.setState({
					...this.state,
					validationErrors: ["That class has already started."]
				})
				return Promise.reject();
			} else {
				return addJuniorPostWrapper.send(makePostJSON({
					juniorFirstName: self.state.formData.juniorFirstName.getOrElse(""),
					beginnerInstanceId: beginner.map(c => c.instanceId),
					intermediate1InstanceId: intermediate1.map(c => c.instanceId),
					intermediate2InstanceId: intermediate2.map(c => c.instanceId)
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
								intermediate1: intermediate1.map(c => ({
									instanceId: c.instanceId,
									dateRange: getClassDate(c),
									timeRange: getClassTime(c),
									signupNote: none
								})),
								intermediate2: intermediate2.map(c => ({
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

				});
			}
		}

		const main = (<React.Fragment>
			{errorPopup}
			<FactaArticleRegion title="Reserve Classes">
				Novice sailors start with our two-week Beginner Sailing, and can reserve a spot below.
				Experienced sailors should email the JP Director at <a href="mailto:juniorprogramdirector@community-boating.org">juniorprogramdirector@community-boating.org</a> for proper class placement.
				<br />
				<br />
				
				Please note:<br /><br />
				<ul>
					<li>
						<span style={{color: "#F00", fontWeight: "bold"}}>
						Class signups and/or waitlists are NOT finalized until registration is complete and payment processed. 
						</span>  Spots are only reserved for 40 minutes.
					</li>
				</ul>
			</FactaArticleRegion>
			<FactaArticleRegion title="Add a Junior">
				Please enter the name of a junior member you'd like to register, select any classes you'd like to reserve a spot in, and then hit submit.
				Once you've signed up and submitted all your children, click "Continue" on the right when you are finished.
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
			</FactaArticleRegion>
			<FactaArticleRegion title="Beginner Sailing">
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
			</FactaArticleRegion>
			<FactaArticleRegion title="Intermediate I">
				<table><tbody><FormSelect
					id="intermediate1MorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediate1MorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedIntermediate1Instance",
					updateStateWrappedForID,
					self.state.formData.selectedIntermediate1Instance,
					self.state.apiResult
						.filter(c => c.typeId == jpClassTypeId_intermediate1)
						.filter(c => c.isMorning == (self.state.formData.intermediate1MorningAfternoon.getOrElse("") == "Morning"))
				)}
			</FactaArticleRegion>
			<FactaArticleRegion title="Intermediate II">
				<table><tbody><FormSelect
					id="intermediate2MorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediate2MorningAfternoon}
					updateAction={self.timeUpdateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/></tbody></table>
				{classReport(
					"selectedIntermediate2Instance",
					updateStateWrappedForID,
					self.state.formData.selectedIntermediate2Instance,
					self.state.apiResult
						.filter(c => c.typeId == jpClassTypeId_intermediate2)
						.filter(c => c.isMorning == (self.state.formData.intermediate2MorningAfternoon.getOrElse("") == "Morning"))
				)}
			</FactaArticleRegion>
			<FactaButton text={<span> &lt; Back</span>} spinnerOnClick={true} onClick={() => Promise.resolve(self.props.history.push(jpBasePath.getPathFromArgs({})))}/>
			<FactaButton text={<span>Create Junior</span>} spinnerOnClick={true} onClick={() => submitAction().then(
				personId =>self.props.history.push(reserveNotesPageRoute.getPathFromArgs({personId: String(personId)})),
				() => window.scrollTo(0, 0)
			)}/>
		</React.Fragment>);

		const sidebar = (<FactaSidebarRegion title="Your Juniors"><table><tbody>
			{self.state.preRegistrations.length==0
				? <tr><td>As you reserve classes for more juniors, they will appear in this box.  When you have reserved a class for all your juniors, click the button below!</td></tr>
				: self.state.preRegistrations.map(preRegRender(() => self.props.history.push(`/redirect${reservePageRoute.getPathFromArgs({})}`)))
			}
			<tr><td>&nbsp;</td></tr>
			<tr><td><FactaButton
				text={<span style={{fontSize: "0.9em"}}>Continue with {self.state.preRegistrations.length} Junior(s) &gt;</span>}
				spinnerOnClick={true}
				onClick={() => {
					const formData = self.state.formData;
					const didStuff = formData.juniorFirstName.isSome() || formData.selectedBeginnerInstance.isSome() || formData.selectedIntermediate1Instance.isSome() || formData.selectedIntermediate2Instance.isSome();
					const juniorCt = self.state.preRegistrations.length;
					if (juniorCt == 0) {
						this.setState({
							...this.state,
							validationErrors: ["Please create at least one junior to continue.  If you are looking to sign up for an advanced sailing class, please contact the JP Director at juniorprogramdirector@community-boating.org to proceed."]
						})
						return Promise.reject();
					} else {
						const s = juniorCt == 1 ? "" : "s";
						if (!didStuff || confirm(`You have unsaved work on this page.  Continue to finalize registration with ${juniorCt} junior${s}?`)) {
							return Promise.resolve(self.props.history.push(createAcctPageRoute.getPathFromArgs({})))
						} else {
							return Promise.resolve();
						}
					}
				}}
			/></td></tr>
			</tbody></table>
			
		</FactaSidebarRegion>);

		return <FactaSidebarPage setBGImage={setJPImage} main={main} right={sidebar} ></FactaSidebarPage>
	}
}
