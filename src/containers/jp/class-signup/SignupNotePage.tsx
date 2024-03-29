import * as React from 'react';
import { Option } from 'fp-ts/lib/Option';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import TextArea from "components/TextArea";
import formUpdateState from 'util/form-update-state';
import FactaButton from 'theme/facta/FactaButton';
import { History } from 'history';
import { postWrapper as saveNote } from "async/junior/signup-note"
import { makePostJSON } from 'core/APIWrapperUtil';
import {classPageRoute} from "app/routes/jp/class"
import { setJPImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';

type Props = {
	history: History<any>,
	personId: number,
	instanceId: number,
	initialNote: Option<string>
}

type Form = {
	signupNote: Option<string>
}

type State = {
	formData: Form
}

class FormTextArea extends TextArea<Form> {}

export default class SignupNotePage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				signupNote: props.initialNote
			}
		};
	}

	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		return <FactaMainPage setBGImage={setJPImage}>
			<FactaArticleRegion title="This class may have multiple sections.">
				This class may be split into multiple sections, each section with its own classroom and instructor.
				If you would like your child to be in class with another junior, please leave their name below.
				We will try our best to honor all such requests.
				<br />
				<br />
				<table><tbody>
				<FormTextArea
					rows={10}
					cols={108}
					id="signupNote"
					value={this.state.formData.signupNote}
					updateAction={updateState}
					placeholder="If you are not trying to sign up with a friend, please leave the text box blank."
				></FormTextArea>
				</tbody></table>
				<br />
				<FactaButton text="< Back" onClick={
					() => Promise.resolve(self.props.history.push(classPageRoute.getPathFromArgs({ personId: String(self.props.personId) })))
				}/>
				<FactaButton text="Save >" spinnerOnClick={true} onClick={() => {
					return saveNote.send(makePostJSON({
						juniorId: self.props.personId,
						instanceId: self.props.instanceId,
						signupNote: self.state.formData.signupNote
					})).then(
						ret => Promise.resolve(self.props.history.push(classPageRoute.getPathFromArgs({ personId: String(self.props.personId) })))
					)
				}}/>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}

// class/188911