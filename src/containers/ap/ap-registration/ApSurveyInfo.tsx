import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import { postWrapper, validator } from "../../../async/member/survey";
import JoomlaButton from "../../../theme/joomla/JoomlaButton";
import { CheckboxGroup, RadioGroup } from "../../../components/InputGroup";
import TextInput from "../../../components/TextInput";
import { makePostJSON } from "../../../core/APIWrapperUtil";
import ethnicities from "../../../lov/ethnicities";
import genders from "../../../lov/genders";
import referralSources from "../../../lov/referralSources";
import FactaArticleRegion from "../../../theme/facta/FactaArticleRegion";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import formUpdateState from '../../../util/form-update-state';
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import FactaMainPage from "../../../theme/facta/FactaMainPage";
import FactaButton from "../../../theme/facta/FactaButton";
 
export type Form = t.TypeOf<typeof validator>

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormCheckbox extends CheckboxGroup<Form>{}

interface Props {
	initialFormData: Form,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element,
	history: History<any>
}

interface State {
	formData: Form
}

export default class ApSurveyInfo extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: this.props.initialFormData
		};
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const data = this.state.formData;


		// TODO: blank out the "other" fields in state when the toggling checkbox is unchecked

		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
            <FactaArticleRegion title="This information is helpful but not required.">
                <table><tbody>
                    <FormRadio
                        id="genderID"
                        label="Gender"
                        columns={3}
                        values={genders}
                        updateAction={updateState}
                        value={data.genderID || none}
                    />
					<FormCheckbox
                        id="referral"
                        label={
							<React.Fragment>
							How did you<br />hear about us?
							</React.Fragment>
						}
                        columns={3}
                        values={referralSources}
                        updateAction={(id: string, value: string) => {
							updateState(id, value);
							window.setTimeout(() => {
								if (!(this.state.formData.referral || some([])).getOrElse([]).contains("Other")) {
									formUpdateState(self.state, self.setState.bind(self), "formData")("referralOther", "");
								}
							}, 0)
							
						}}
						value={(data.referral || none)}
                    />
					{
						(data.referral || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="referralOther"
							label="Other"
							value={data.referralOther || none}
							updateAction={updateState}
						/>
						: null
					}
					<FormInput
						id="occupation"
						label={
							<React.Fragment>
							Occupation
							</React.Fragment>
						}
						value={data.occupation || none}
						updateAction={updateState}
					/>
					<FormInput
						id="employer"
						label={
							<React.Fragment>
							Employer
							</React.Fragment>
						}
						value={data.employer || none}
						updateAction={updateState}
					/>
                    <FormRadio
                        id="matchingContributions"
                        label={<React.Fragment>Does your company match<br />employee contributions?</React.Fragment>}
                        values={[
							{ key: "Y", display: "Yes"},
							{ key: "N", display: "No"},
							{ key: "?", display: "I don't know/Not applicable"},
						]}
                        updateAction={updateState}
                        value={data.matchingContributions || none}
                    />
					<FormInput
						id="language"
						label={
							<React.Fragment>
							Primary language<br />spoken at home
							</React.Fragment>
						}
						value={data.language || none}
						updateAction={updateState}
					/>
					<FormCheckbox
                        id="ethnicity"
                        label="Ethnicity"
                        columns={3}
                        values={ethnicities}
                        updateAction={(id: string, value: string) => {
							updateState(id, value);
							window.setTimeout(() => {
								if (!(this.state.formData.ethnicity || some([])).getOrElse([]).contains("Other")) {
									formUpdateState(self.state, self.setState.bind(self), "formData")("ethnicityOther", "");
								}
							}, 0)
						}}
						value={(data.ethnicity || none)}
                    />
					{
						(data.ethnicity || some([])).getOrElse([]).contains("Other")
						? <FormInput
							id="ethnicityOther"
							label="Other"
							value={data.ethnicityOther || none}
							updateAction={updateState}
						/>
						: null
					}
                    <FormRadio
                        id="student"
                        label="Student"
                        values={[
							{ key: "Y", display: "Yes"},
							{ key: "N", display: "No"},
						]}
                        updateAction={(id: string, value: string) => {
							updateState(id, value);
							window.setTimeout(() => {
								if ((this.state.formData.student || some("Y")).getOrElse("Y") == "N") {
									formUpdateState(self.state, self.setState.bind(self), "formData")("school", "");
								}
							}, 0)
							
						}}
                        value={data.student || none}
                    />
					{
						(data.student.getOrElse("N") == "Y")
						? <FormInput
							id="school"
							label="School"
							value={data.school || none}
							updateAction={updateState}
						/>
						: null
					}
                </tbody></table>
            </FactaArticleRegion>
			<FactaButton text="< Back" onClick={self.props.goPrev}/>
			<FactaButton text="Next >" spinnerOnClick onClick={() => {
				return postWrapper.send(makePostJSON(this.state.formData)).then(self.props.goNext)
			}}/>
		</FactaMainPage>
	}
}