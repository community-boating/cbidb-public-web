import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as t from 'io-ts';
import * as React from "react";

import { postWrapper, validator } from "../../async/junior/survey";
import Button from "../../components/Button";
import { CheckboxGroup, RadioGroup, SingleCheckbox } from "../../components/InputGroup";
import TextInput from "../../components/TextInput";
import { PostJSON } from "../../core/APIWrapper";
import ethnicities from "../../lov/ethnicities";
import genders from "../../lov/genders";
import referralSources from "../../lov/referralSources";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../theme/joomla/JoomlaNotitleRegion";
import formUpdateState from '../../util/form-update-state';
import NavBarLogoutOnly from "../../components/NavBarLogoutOnly";

export const formName = "surveyInfoForm"
 
export type Form = t.TypeOf<typeof validator>

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormCheckbox extends CheckboxGroup<Form>{}
class FormBoolean extends SingleCheckbox<Form>{}

interface Props {
	personId: number,
	initialFormData: Form,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element,
	history: History<any>
}

interface State {
	formData: Form
}

export default class SurveyInfo extends React.Component<Props, State> {
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

		return <JoomlaMainPage navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
            <JoomlaArticleRegion title="This information is helpful but not required.">
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
					<FormInput
						id="school"
						label="School"
						value={data.school || none}
						updateAction={updateState}
					/>
					<FormBoolean
						id="freeLunch"
						label={
							<React.Fragment>
							Eligible for Free/<br />Reduced Price Lunch?
							</React.Fragment>
						}
						value={data.freeLunch}
						updateAction={updateState}
					/>
                </tbody></table>
            </JoomlaArticleRegion>
			<Button text="< Back" onClick={self.props.goPrev}/>
			<Button text="Next >" spinnerOnClick onClick={() => {
				return postWrapper(this.props.personId).send(PostJSON(this.state.formData)).then(self.props.goNext)
			}}/>
		</JoomlaMainPage>
	}
}