import { none, some, Option } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';
import * as moment from 'moment';
import * as _ from 'lodash';

import Button from "../../../components/Button";
import JoomlaArticleRegion from "../../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import Currency from "../../../util/Currency";
import JoomlaReport from "../../../theme/joomla/JoomlaReport";
import { singlePaymentValidator } from "../../../async/member/payment-plan-options";
import {postWrapper as submit} from "../../../async/member/set-payment-plan"
import { makePostJSON } from "../../../core/APIWrapperUtil";
import { StaggeredPaymentSchedule } from "../../../components/StaggeredPaymentSchedule";
import { MAGIC_NUMBERS } from "../../../app/magicNumbers";
import { RadioGroup } from "../../../components/InputGroup";

type SinglePayment = t.TypeOf<typeof singlePaymentValidator>;

interface Props {
	membershipTypeId: number,
	appliedDiscountId: Option<number>,
	basePrice: Currency,
	discountAmt: Option<Currency>,
	paymentSchedules: SinglePayment[][],
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

type State = {
	selectedNumberPayments: Option<number>,
	radio: "Yes" | "No"
}

export default class ApStaggeredPaymentsPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedNumberPayments: none,
			radio: null
		}
	}
	discountedPrice = Currency.cents(this.props.basePrice.cents - this.props.discountAmt.map(c => c.cents).getOrElse(0))
	doRenewal = this.props.appliedDiscountId.getOrElse(null) == MAGIC_NUMBERS.DISCOUNT_ID.RENEWAL_DISCOUNT_ID;
	renewalText = <React.Fragment>
		<br />
		Please note that the renewal pricing of {this.discountedPrice.format()} is
		only availble to plans that have fully paid <b>before</b> the current membership has expired.
		Such plans are indicated in the table above with an asterisk (<b>*</b>)
	</React.Fragment>;
	schedulePicker() {
		const self = this;
		const getRadio = (paymentCt: number) => (<input
			type="radio"
			key={`sel_${paymentCt}`}
			id={`sel_${paymentCt}`}
			name={`sel_${paymentCt}`}
			value={paymentCt}
			onChange={(e) => this.setState({ ...this.state, selectedNumberPayments: some(Number(e.target.value))})}
			checked={this.state.selectedNumberPayments.getOrElse(null) == paymentCt}
		/>);
		const totals = this.props.paymentSchedules.map(s => s.reduce((agg, p) => agg + p.paymentAmtCents, 0));
		return <React.Fragment>
			<JoomlaReport
				headers={["Payments", "Monthly Amt", "Final Payment", "Total"]}
				cellStyles={[{textAlign: "left"}, {textAlign: "right"}, {textAlign: "right"}, {textAlign: "right"}]}
				rows={this.props.paymentSchedules.filter((s, i) => i > 0).map(s => 
					[
						<span>{getRadio(s.length)}<label htmlFor={`sel_${s.length}`}>{s.length}</label></span>,
						Currency.cents(s[0].paymentAmtCents).format(),
						moment(s[s.length-1].paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
						(function() {
							const total = s.reduce((agg, p) => agg + p.paymentAmtCents, 0);
							const totalFormatted = Currency.cents(total).format();
							if (self.doRenewal && total == totals[0]) {
								return <b>*{totalFormatted}</b>
							} else {
								return totalFormatted;
							}
						}())
					]
				)}
			/>
			{this.doRenewal ? this.renewalText : null}
		</React.Fragment>
	}
	scheduleDetail() {
		return this.state.selectedNumberPayments.map(ct => {
			const schedule = this.props.paymentSchedules[ct - 1]
			return <StaggeredPaymentSchedule schedule={schedule}/>;
		}).getOrElse(null);
	}
	render() {
		const self = this;		
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Payment in monthly installments is available.">
				Our payment plan options makes securing your season of sailing even easier.
				With no interest, this plan breaks down the cost of your membership into a number of payments of your choosing.
				Your card will be automatically charged each month, once your payment plan is complete your membership will be activated.
				<br /><br />
				<RadioGroup
					id="doStaggers"
					label=""
					columns={1}
					values={[{
						key: "No",
						display: "I elect to pay the full cost of my membership today."
					}, {
						key: "Yes",
						display: "I would like to pay for my membership in monthly installments."
					}]}
					updateAction={(id: string, radio: "Yes" | "No") => {
						self.setState({
							...this.state,
							radio
						})
					}}
					value={self.state ? some(self.state.radio) : none}
					justElement={true}
				/>
				<br />
				{
					this.state.radio == "Yes"
					? <table style={{width: "100%"}}><tbody><tr>
						<td style={{verticalAlign: "top", width: "50%"}}>
							{this.schedulePicker()}
						</td>
						<td style={{verticalAlign: "top", width: "50%"}}>
							{this.scheduleDetail()}
						</td>
					</tr></tbody></table>
					: null
				}
				
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={self.props.goPrev}/>
			{self.state.radio == "No" || (self.state.selectedNumberPayments && self.state.selectedNumberPayments.isSome())
				? <Button text="Next >" spinnerOnClick onClick={() => {
					return submit.send(makePostJSON({
						additionalPayments: self.state.radio == "No" ? 0 : self.state.selectedNumberPayments.getOrElse(1)-1
					})).then(res => {
						if (res.type == "Success") {
							self.props.goNext()
						} else {
							window.scrollTo(0, 0);
						}
					})
				}}/>
				: ""}
		</JoomlaMainPage>
	}
}