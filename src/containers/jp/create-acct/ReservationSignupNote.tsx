import * as React from 'react';
import { Option, none } from 'fp-ts/lib/Option';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import TextArea from "components/TextArea";
import formUpdateState from 'util/form-update-state';
import FactaButton from 'theme/facta/FactaButton';
import { History } from 'history';
import { postWrapper as saveNote } from "async/junior/signup-note-proto"
import { makePostJSON } from 'core/APIWrapperUtil';
import { PreRegistration } from 'app/global-state/jp-pre-registrations';
import {reservePageRoute} from "app/routes/jp/reserve"
import { setJPImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';

type Props = {
	history: History<any>,
	personId: number,
	startingPreRegistrations: PreRegistration[]
}

// type ClassState = {
// 	instanceId: number,
// 	signupNote: Option<string>
// }

type Form = {
	beginnerInstanceId: Option<number>,
	intermediate1InstanceId: Option<number>,
	intermediate2InstanceId: Option<number>,
	beginnerSignupNote: Option<string>,
	intermediate1SignupNote: Option<string>
	intermediate2SignupNote: Option<string>
}

type State = {
	formData: Form
}

class FormTextArea extends TextArea<Form> {}

export default class ReservationSignupNote extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		const thisJuniorReservations = props.startingPreRegistrations.filter(e => e.juniorPersonId == props.personId);
		if (thisJuniorReservations.length == 1) {
			this.state = {
				formData: {
					beginnerInstanceId: thisJuniorReservations[0].beginner.map(e => e.instanceId),
					intermediate1InstanceId: thisJuniorReservations[0].intermediate1.map(e => e.instanceId),
					intermediate2InstanceId: thisJuniorReservations[0].intermediate2.map(e => e.instanceId),
					beginnerSignupNote: thisJuniorReservations[0].beginner.chain(e => e.signupNote),
					intermediate1SignupNote: thisJuniorReservations[0].intermediate1.chain(e => e.signupNote),
					intermediate2SignupNote: thisJuniorReservations[0].intermediate2.chain(e => e.signupNote),
				}
			};
		} else {
			this.state = {
				formData: {
					beginnerInstanceId: none,
					intermediate1InstanceId: none,
					intermediate2InstanceId: none,
					beginnerSignupNote: none,
					intermediate1SignupNote: none,
					intermediate2SignupNote: none,
				}
			};
		}
	}

	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const beginnerTextArea = (
			<React.Fragment>
				<br />
				<br />
				<b>Beginner Sailing:</b>
				<table><tbody>
					<FormTextArea
						rows={10}
						cols={108}
						id="beginnerSignupNote"
						value={this.state.formData.beginnerSignupNote}
						updateAction={updateState}
						placeholder="If you are not trying to sign up with a friend, please leave the text box blank."
					></FormTextArea>
				</tbody></table>
			</React.Fragment>
		);

		const intermediate1TextArea = (
			<React.Fragment>
				<br />
				<br />
				<b>Intermediate I:</b>
				<table><tbody>
					<FormTextArea
						rows={10}
						cols={108}
						id="intermediate1SignupNote"
						value={this.state.formData.intermediate1SignupNote}
						updateAction={updateState}
						placeholder="If you are not trying to sign up with a friend, please leave the text box blank."
					></FormTextArea>
				</tbody></table>
			</React.Fragment>
		);

		const intermediate2TextArea = (
			<React.Fragment>
				<br />
				<br />
				<b>Intermediate II:</b>
				<table><tbody>
					<FormTextArea
						rows={10}
						cols={108}
						id="intermediate2SignupNote"
						value={this.state.formData.intermediate2SignupNote}
						updateAction={updateState}
						placeholder="If you are not trying to sign up with a friend, please leave the text box blank."
					></FormTextArea>
				</tbody></table>
			</React.Fragment>
		);

		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="These classes may have multiple sections.">
			These classes may be split into multiple sections, each section with its own classroom and instructor.
				If you would like your child to be in class with another junior, please leave their name below.
				We will try our best to honor all such requests.
				{this.state.formData.beginnerInstanceId.isSome() ? beginnerTextArea : null}
				{this.state.formData.intermediate1InstanceId.isSome() ? intermediate1TextArea : null}
				{this.state.formData.intermediate2InstanceId.isSome() ? intermediate2TextArea : null}
				<br />
				<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(reservePageRoute.getPathFromArgs({})))}/>
				<FactaButton text="Save >" spinnerOnClick={true} onClick={() => {
					const saveBeginner = self.state.formData.beginnerInstanceId.map(b => () => saveNote.sendJson({
						juniorId: self.props.personId,
						instanceId: b,
						signupNote: self.state.formData.beginnerSignupNote
					}));

					const saveIntermediate1 = self.state.formData.intermediate1InstanceId.map(i => () => saveNote.sendJson({
						juniorId: self.props.personId,
						instanceId: i,
						signupNote: self.state.formData.intermediate1SignupNote
					}));

					const saveIntermediate2 = self.state.formData.intermediate2InstanceId.map(i => () => saveNote.sendJson({
						juniorId: self.props.personId,
						instanceId: i,
						signupNote: self.state.formData.intermediate2SignupNote
					}));

					return Promise.all([
						saveBeginner.getOrElse(() => Promise.resolve(null))(),
						saveIntermediate1.getOrElse(() => Promise.resolve(null))(),
						saveIntermediate2.getOrElse(() => Promise.resolve(null))(),
					]).then(([beginnerResult, intermediate1Result, intermediate2Result]) => {
						self.props.history.push(reservePageRoute.getPathFromArgs({}))
					})
				}}/>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
