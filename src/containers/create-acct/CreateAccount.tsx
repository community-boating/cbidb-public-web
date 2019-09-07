import { Option, none, some } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import * as React from "react";
import TextInput from "../../components/TextInput";
import Joomla8_4 from '../../theme/joomla/Joomla8_4';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import JoomlaSidebarRegion from '../../theme/joomla/JoomlaSidebarRegion';
import formUpdateState from '../../util/form-update-state';
import { Select } from '../../components/Select';
import {validator} from "../../async/class-instances-with-avail"

type ApiResult = t.TypeOf<typeof validator>;

type Props = {
	apiResult: ApiResult
}

const morningAfternoonValues = [
	"Morning",
	"Afternoon"
]

const defaultForm = {
	juniorFirstName: none as Option<string>,
	beginnerMorningAfternoon: some("Morning") as Option<string>,
	intermediateMorningAfternoon: some("Morning") as Option<string>,
}

export type Form = typeof defaultForm

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}

export default class CreateAccount extends React.Component<Props, {formData: Form}> {
	constructor(props: Props) {
		super(props);
		console.log("constructing createAccount")
		this.state = {
			formData: defaultForm
		};
	}
	render() {
		const self= this;
		const formData = this.state.formData;

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const main = (<React.Fragment>
			<JoomlaArticleRegion title="Reserve Classes">
				New sailors should take our two-week Beginner Sailing class.
				You may also sign your child up for a two-week Intermediate Sailing class.
				We recommend signing up all new sailors/members for a one-hour Paddling Introduction so they can go paddling when not in class.
				<br />
				<br />
				<p>
					<span style={{color: "#F00", fontWeight: "bold"}}>Note that your class signup is not finalized until registration is complete and payment is processed.  </span>
					Your spots will be held for 60 minutes after submitting your first reservation.
				</p>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="First Junior">
				Please enter the name of a junior member you'd like to register, and select any classes you'd like to reserve a spot in. 
				If you have multiple juniors to register, click "Add Another Junior" below to add more.
				<br />
				<br />
				<table><tbody><FormInput
					id="juniorFirstName"
					label="Junior First Name"
					value={formData.juniorFirstName}
					updateAction={updateState}
					appendToElementCell={<span style={{color: "#777", fontSize: "0.8em"}}>  (We'll collect more information later)</span>}
				/></tbody></table>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Beginner Sailing">
				<FormSelect
					id="beginnerMorningAfternoon"
					label="Choose a time:  "
					value={formData.beginnerMorningAfternoon}
					updateAction={updateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Intermediate Sailing">
				<FormSelect
					id="intermediateMorningAfternoon"
					label="Choose a time:  "
					value={formData.intermediateMorningAfternoon}
					updateAction={updateState}
					options={morningAfternoonValues.map(e => ({key: e, display: e}))}
				/>
			</JoomlaArticleRegion>
		</React.Fragment>);

		const sidebar = (<JoomlaSidebarRegion title="Your Juniors">
			As you reserve classes for more juniors, they will appear in this box!
		</JoomlaSidebarRegion>);

		return <Joomla8_4 main={main} right={sidebar} />
	}
}