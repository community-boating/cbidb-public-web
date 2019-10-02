import { none, Option } from 'fp-ts/lib/Option';
import { History } from "history";
import * as React from "react";

import asc from "../app/AppStateContainer";
import { postWrapper as postNo } from "../async/junior/scholarship-no";
import { postWrapper as postYes } from "../async/junior/scholarship-yes";
import Button from "../components/Button";
import { RadioGroup, SingleCheckbox } from "../components/InputGroup";
import { Select } from "../components/Select";
import TextInput from "../components/TextInput";
import { PostJSON } from "../core/APIWrapper";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../theme/joomla/JoomlaNotitleRegion";
import Currency from "../util/Currency";
import formUpdateState from '../util/form-update-state';
import ErrorDiv from '../theme/joomla/ErrorDiv';


export const formName = "scholarshipForm"

export interface Form {
	isApplying: Option<string>,
	numberAdults: Option<string>,
	haveInsurance: Option<string>,
	numberInfants: Option<string>,
	numberPreschoolers: Option<string>,
	numberSchoolagers: Option<string>,
	numberTeenagers: Option<string>,
	income: Option<string>,
	doAgree: Option<boolean>
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}
class FormBoolean extends SingleCheckbox<Form>{}

interface Props {
	currentSeason: number,
	jpPrice: Currency,
	parentPersonId: number,
	history: History<any>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element
}

interface State {
	formData: Form,
	validationErrors: string[]
}

function generateOptions(singular: string, plural: string, min: number, max: number) {
	var ret = [];
	for (var i=min; i<=max; i++) {
		const isLast = (i == max);
		ret.push({
			key: String(i),
			display: i + (isLast ? " or more " : " ") + (i==1 ? singular : plural)
		})
	}
	return ret;
}

export default class ScholarshipPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				isApplying: none,
				numberAdults: none,
				haveInsurance: none,
				numberInfants: none,
				numberPreschoolers: none,
				numberSchoolagers: none,
				numberTeenagers: none,
				income: none,
				doAgree: none
			},
			validationErrors: []
		};
	}
	render() {
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const radioValues = [{
			key: "No",
			display: <span><b>No, </b>{`I would like to purchase a ${this.props.currentSeason} Junior Program membership and/or off-season class at full price.`}</span>
		}, {
			key: "Yes",
			display: <span><b>Yes, </b>{`I would like to apply for a scholarship for which I will need to provide information about my family.`}</span>
		}]

		const familyInfo =
			<React.Fragment>
				<JoomlaArticleRegion title="Please provide the following information.">
					<div style={{marginLeft: "20px"}}><table><tbody>
						<tr>
							<td>How many adults are in your immediate family?</td>
							<td><FormSelect
								id="numberAdults"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("Adult", "Adults", 0, 3)}
								value={self.state.formData.numberAdults}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>Do you have employment based health insurance?</td>
							<td><FormSelect
								id="haveInsurance"
								justElement={true}
								nullDisplay="- Select -"
								options={[{
									key: "Y", display: "Yes"
								}, {
									key: "N", display: "No"
								}]}
								value={self.state.formData.haveInsurance}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>How many infants (children aged 0-2) are in your immediate family?</td>
							<td><FormSelect
								id="numberInfants"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("Infant", "Infants", 0, 7)}
								value={self.state.formData.numberInfants}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>How many preschool-age children (ages 3-4) are in your immediate family?</td>
							<td><FormSelect
								id="numberPreschoolers"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("Preschooler", "Preschoolers", 0, 7)}
								value={self.state.formData.numberPreschoolers}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>How many school-age children (ages 5-12) are in your immediate family?</td>
							<td><FormSelect
								id="numberSchoolagers"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("School-age Child", "School-age Children", 0, 7)}
								value={self.state.formData.numberSchoolagers}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>How many teenagers (ages 13-17) are in your immediate family?</td>
							<td><FormSelect
								id="numberTeenagers"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("Teenager", "Teenagers", 0, 7)}
								value={self.state.formData.numberTeenagers}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>Please enter your Adjusted Gross Income:*</td>
							<td>
								<FormInput id="income" justElement={true} value={self.state.formData.income} updateAction={updateState} />
								<span style={{color: "#777", fontSize: "0.9em"}}>(ex. $50,000)</span>
							</td>
						</tr>	
					</tbody></table></div>
					<br /><br />
					<div style={{padding: "8px 50px", border: "1px solid #999", margin: "0px 30px"}}>
						* <b>Adjusted Gross Income</b>
						<br />
						<br />
						Adjusted Gross Income is defined as gross income minus adjustments to income.
						We suggest you refer to your 2017 federal income tax return to get a quick estimate of your 2018 AGI.
						On your 2017 return, please refer to:<br />
						<br />
						<ul>
							<li>Line 4 if you filed a Form 1040EZ</li>
							<li>Line 21 if you filed a Form 1040A</li>
							<li>Line 37 if you filed a Form 1040</li>
						</ul>
					</div>
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title="You must agree to the following terms to apply for a scholarship.">
					{`I understand CBI offers need-based scholarships to junior member families to uphold its mission of Sailing for All.
					By applying for a CBI scholarship, I am affirming that all information provided about my family make-up and household income is true and accurate.
					I also understand that CBI reserves the right to require documentation at any point in the application process.`}
					<br />
					<br />
					<FormBoolean id="doAgree" justElement={true} value={(self.state.formData.doAgree || none)} label="I agree to the above terms for scholarship application." updateAction={updateState}/>
				</JoomlaArticleRegion>
			</React.Fragment>

		const next = <Button text="Next >" onClick={() => {
			const form = self.state.formData
			const isApplying = form.isApplying.getOrElse("No") == "Yes"
			if (isApplying) {
				return postYes().send(PostJSON({
					numberWorkers: Number(form.numberAdults.getOrElse("0")),
					hasBenefits: form.haveInsurance.getOrElse("N") == "Y",
					infantCount:  Number(form.numberInfants.getOrElse("0")),
					preschoolerCount:  Number(form.numberPreschoolers.getOrElse("0")),
					schoolagerCount:  Number(form.numberSchoolagers.getOrElse("0")),
					teenagerCount:  Number(form.numberTeenagers.getOrElse("0")),
					income:  Number(form.income.getOrElse("0"))
				})).then(self.props.goNext)
			} else {
				return postNo().send(PostJSON({})).then(self.props.goNext)
			}
			
		}}/>

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <JoomlaMainPage>
			{errorPopup}
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Scholarships are available to provide sailing for all.">
				We strive to make Junior Memberships affordable for all.<br />
				{
					`The fee for Junior Program membership is on a sliding scale from $1 - ${self.props.jpPrice.format(true)} for the entire summer; 
					all classes included in this fee. Families can find out if they qualify for an income based reduced fee by filling out
					our form online during registration. `
				}
				<br />
				<br />
				<b>Would you like to apply for a reduced Junior Program Membership fee? Please select one: </b>
				<br />
				<br />
				<div style={{marginLeft: "20px"}}>
					<FormRadio id="isApplying" justElement={true} values={radioValues} updateAction={updateState} value={self.state.formData.isApplying}/>
				</div>
			</JoomlaArticleRegion>
			{self.state.formData.isApplying.getOrElse(null) == "Yes" ? familyInfo : ""}
			<Button text="< Back" onClick={self.props.goPrev}/>

			{(function() {
				const form = self.state.formData
				const isApplying = (form.isApplying || none).getOrElse("")
				const doAgree = (form.doAgree || none).getOrElse(false)
				if (isApplying == "No" || (isApplying == "Yes" && doAgree)) return next
				else return null
			}())}
		</JoomlaMainPage>
	}
}