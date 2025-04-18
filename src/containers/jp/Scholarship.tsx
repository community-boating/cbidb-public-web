import { none, Option } from 'fp-ts/lib/Option';
import { History } from "history";
import * as React from "react";

import { postWrapper as postNo } from "async/junior/scholarship-no";
import { postWrapper as postYes } from "async/junior/scholarship-yes";
import FactaButton from "theme/facta/FactaButton";
import { RadioGroup, SingleCheckbox } from "components/InputGroup";
import { Select } from "components/Select";
import TextInput from "components/TextInput";
import { makePostJSON } from "core/APIWrapperUtil";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaNotitleRegion from "theme/facta/FactaNotitleRegion";
import Currency from "util/Currency";
import formUpdateState from 'util/form-update-state';
import {FactaErrorDiv} from 'theme/facta/FactaErrorDiv';
import { setJPImage } from 'util/set-bg-image';
import FactaMainPage from 'theme/facta/FactaMainPage';

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
				<FactaArticleRegion title="Please provide the following information.">
					<div style={{marginLeft: "20px"}}><table><tbody>
						<tr>
							<td>How many adults are in your immediate family?</td>
							<td><FormSelect
								id="numberAdults"
								justElement={true}
								nullDisplay="- Select -"
								options={/*generateOptions("Adult", "Adults", 1, 2) */[{
									key: "1",
									display: "1 Adult"
								}, {
									key: "2",
									display: "2 Adults, both working"
								}, {
									key: "-1",
									display: "2 Adults, only 1 working"
								}]}
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
								options={generateOptions("Child", "Children", 1, 3)}
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
						We suggest you refer to your most recent federal income tax return to get a quick estimate of your current AGI.
						On your most recent return, please refer to:<br />
						<br />
						<ul>
							<li>Line 11 if you file a Form 1040</li>
							<li>Line 11 if you file a Form 1040SR</li>
						</ul>
					</div>
				</FactaArticleRegion>
				<FactaArticleRegion title="You must agree to the following terms to apply for a scholarship.">
					{`I understand CBI offers need-based scholarships to junior member families to uphold its mission of Sailing for All.
					By applying for a CBI scholarship, I am affirming that all information provided about my family make-up and household income is true and accurate.
					I also understand that CBI reserves the right to require documentation at any point in the application process.`}
					<br />
					<br />
					<FormBoolean id="doAgree" justElement={true} value={(self.state.formData.doAgree || none)} label="I agree to the above terms for scholarship application." updateAction={updateState}/>
				</FactaArticleRegion>
			</React.Fragment>

		const form = self.state.formData

		const next = <FactaButton text="Next >" spinnerOnClick onClick={() => {
			const isApplying = form.isApplying.getOrElse("No") == "Yes"
			if (isApplying) {
				const rawIncome = form.income.getOrElse("0");
				const afterReplace = rawIncome.replace(/,/g,"").replace(/\$/g,"");
				return postYes().send(makePostJSON({
					numberWorkers: Number(form.numberAdults.getOrElse("0")),
					childCount: Number(form.numberChildren.getOrElse("0")),
					income:  Number(afterReplace)
				})).then(self.props.goNext)
			} else {
				return postNo().send(makePostJSON({})).then(() => {
					window.location.href = window.location.pathname
				})
			}
			
		}}/>

		const formCompleted = form.income.isSome() && form.numberAdults.isSome() && form.numberChildren.isSome();

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setJPImage} errors={this.state.validationErrors}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="We offer reduced fees to enable sailing for all!">
				{
					`We strive to make Junior Membership affordable to all. Our fee is on a generous need-based sliding scale
					from $1 to ${self.props.jpPrice.format(true)} and includes membership, classes, and boat usage;
					everything we offer for ten summer weeks! Please apply below for a reduced price membership
					based on household income and family makeup. Memberships are non-refundable and non-transferable.
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
			</FactaArticleRegion>
			{self.state.formData.isApplying.getOrElse(null) == "Yes" ? familyInfo : ""}
			<FactaButton text="< Back" onClick={self.props.goPrev}/>

			{(function() {
				const form = self.state.formData
				const isApplying = (form.isApplying || none).getOrElse("")
				const doAgree = (form.doAgree || none).getOrElse(false)
				if (isApplying == "No" || (isApplying == "Yes" && doAgree && formCompleted)) return next
				else return null
			}())}
		</FactaMainPage>
	}
}