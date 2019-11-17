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
	numberChildren: Option<string>,
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
				numberChildren: none,
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
			display: <span><b>No, </b>{`I'd like to purchase a Junior Program membership at full price.`}</span>
		}, {
			key: "Yes",
			display: <span><b>Yes, </b>{`I'd like to apply for a reduced fee and will provide information about my family makeup and household income.`}</span>
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
								options={generateOptions("Adult", "Adults", 1, 2)}
								value={self.state.formData.numberAdults}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>How many children are in your immediate family?</td>
							<td><FormSelect
								id="numberChildren"
								justElement={true}
								nullDisplay="- Select -"
								options={generateOptions("Child", "Children", 1, 6)}
								value={self.state.formData.numberChildren}
								updateAction={updateState}
							/></td>
						</tr>	
						<tr>
							<td>Please enter your Adjusted Gross Income:*</td>
							<td>
								<FormInput id="income" justElement={true} value={self.state.formData.income} updateAction={updateState} />
								<span style={{color: "#777", fontSize: "0.9em"}}>(e.g. $50,000)</span>
							</td>
						</tr>	
					</tbody></table></div>
					<br /><br />
					<div style={{padding: "8px 50px", border: "1px solid #999", margin: "0px 30px"}}>
						* <b>Adjusted Gross Income</b>
						<br />
						<br />
						Adjusted Gross Income is defined as gross income minus adjustments to income.
						We suggest you refer to your {self.props.currentSeason-2} federal income tax return to get a quick estimate of your {self.props.currentSeason-1} AGI.
						On your {self.props.currentSeason-2} return, please refer to:<br />
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

		const next = <Button text="Next >" spinnerOnClick onClick={() => {
			const form = self.state.formData
			const isApplying = form.isApplying.getOrElse("No") == "Yes"
			if (isApplying) {
				return postYes().send(PostJSON({
					numberWorkers: Number(form.numberAdults.getOrElse("0")),
					childCount: Number(form.numberChildren.getOrElse("0")),
					income:  Number(form.income.getOrElse("0"))
				})).then(self.props.goNext)
			} else {
				return postNo().send(PostJSON({})).then(() => {
					window.location.href = window.location.pathname
				})
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
			<JoomlaArticleRegion title="We offer reduced fees to enable sailing for all!">
				{
					`We strive to make Junior Membership affordable to all. Our fee is on a generous need-based sliding scale
					from $1 to ${self.props.jpPrice.format(true)} and includes membership, classes, and boat usage;
					everything we offer for ten summer weeks! Please apply below for a reduced price membership
					based on household income and family makeup. Memberships are non-refundable and non-transferable.
					Register before Jan 1 to lock in last year's pricing!
					`
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