import * as React from 'react';
import { Option, none } from 'fp-ts/lib/Option';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import TextArea from "../../components/TextArea";
import formUpdateState from '../../util/form-update-state';
import Button from '../../components/Button';
import { History } from 'history';
import { postWrapper as saveNote } from "../../async/junior/signup-note-proto"
import { PostJSON } from '../../core/APIWrapper';
import { PreRegistration } from '../../app/global-state/jp-pre-registrations';
import reservePageRoute from "../../app/routes/jp/reserve"

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
	intermediateInstanceId: Option<number>,
	beginnerSignupNote: Option<string>,
	intermediateSignupNote: Option<string>
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
					intermediateInstanceId: thisJuniorReservations[0].intermediate.map(e => e.instanceId),
					beginnerSignupNote: thisJuniorReservations[0].beginner.chain(e => e.signupNote),
					intermediateSignupNote: thisJuniorReservations[0].intermediate.chain(e => e.signupNote),
				}
			};
		} else {
			this.state = {
				formData: {
					beginnerInstanceId: none,
					intermediateInstanceId: none,
					beginnerSignupNote: none,
					intermediateSignupNote: none,
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

		const intermediateTextArea = (
			<React.Fragment>
				<br />
				<br />
				<b>Intermediate Sailing:</b>
				<table><tbody>
					<FormTextArea
						rows={10}
						cols={108}
						id="intermediateSignupNote"
						value={this.state.formData.intermediateSignupNote}
						updateAction={updateState}
						placeholder="If you are not trying to sign up with a friend, please leave the text box blank."
					></FormTextArea>
				</tbody></table>
			</React.Fragment>
		);

		return <JoomlaMainPage>
			<JoomlaArticleRegion title="These classes may have multiple sections.">
			These classes may be split into multiple sections, each section with its own classroom and instructor.
				If you would like your child to be in class with another junior, please leave their name below.
				We will try our best to honor all such requests.
				{this.state.formData.beginnerInstanceId.isSome() ? beginnerTextArea : null}
				{this.state.formData.intermediateInstanceId.isSome() ? intermediateTextArea : null}
				<br />
				<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push(reservePageRoute.getPathFromArgs({})))}/>
				<Button text="Save >" spinnerOnClick={true} onClick={() => {
					const saveBeginner = self.state.formData.beginnerInstanceId.map(b => () => saveNote.send(PostJSON({
						juniorId: self.props.personId,
						instanceId: b,
						signupNote: self.state.formData.beginnerSignupNote
					})));

					const saveIntermediate = self.state.formData.intermediateInstanceId.map(i => () => saveNote.send(PostJSON({
						juniorId: self.props.personId,
						instanceId: i,
						signupNote: self.state.formData.intermediateSignupNote
					})));

					return Promise.all([
						saveBeginner.getOrElse(() => Promise.resolve(null))(),
						saveIntermediate.getOrElse(() => Promise.resolve(null))(),
					]).then(([beginnerResult, intermediateResult]) => {
						self.props.history.push(reservePageRoute.getPathFromArgs({}))
					})
				}}/>
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
