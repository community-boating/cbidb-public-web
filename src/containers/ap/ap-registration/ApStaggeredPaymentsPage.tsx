import { none, some, Option } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';
import * as moment from 'moment';
import * as _ from 'lodash';

import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import FactaMainPage from "theme/facta/FactaMainPage";
import FactaNotitleRegion from "theme/facta/FactaNotitleRegion";
import NavBarLogoutOnly from "components/NavBarLogoutOnly";
import { setAPImage } from "util/set-bg-image";
import Currency from "util/Currency";
import { planValidator } from "async/member/payment-plan-options";
import {postWrapper as submit} from "async/member/set-payment-plan"
import { makePostJSON } from "core/APIWrapperUtil";
import { StaggeredPaymentSchedule } from "components/StaggeredPaymentSchedule";
import { MAGIC_NUMBERS } from "app/magicNumbers";
import { RadioGroup } from "components/InputGroup";
import FactaButton from "theme/facta/FactaButton";
import StandardReport from "theme/facta/StandardReport";

export type Plan = t.TypeOf<typeof planValidator>

interface Props {
	membershipTypeId: number,
	appliedDiscountId: Option<number>,
	basePrice: Currency,
	discountAmt: Option<Currency>,
	paymentSchedules: Plan[],
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
		<br />
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
		const totals = this.props.paymentSchedules.map(s => s.payments.reduce((agg, p) => agg + p.paymentAmtCents, 0));
		return <React.Fragment>
			<StandardReport
				headers={["Payments", "Monthly Amt", "Final Payment", "Membership Start", "Total"]}
				cellStyles={[{textAlign: "left"}, {textAlign: "right"}, {textAlign: "right"}, {textAlign: "right"}]}
				rows={this.props.paymentSchedules.filter((s, i) => i > 0).map(s => 
					[
						<span>{getRadio(s.payments.length)}<label htmlFor={`sel_${s.payments.length}`}>{s.payments.length}</label></span>,
						Currency.cents(s.payments[0].paymentAmtCents).format(),
						moment(s.payments[s.payments.length-1].paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
						moment(s.startDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
						(function() {
							const total = s.payments.reduce((agg, p) => agg + p.paymentAmtCents, 0);
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
		</React.Fragment>
	}
	scheduleDetail() {
		return this.state.selectedNumberPayments.map(ct => {
			const schedule = this.props.paymentSchedules[ct - 1].payments
			return <StaggeredPaymentSchedule schedule={schedule}/>;
		}).getOrElse(null);
	}
	render() {
		const self = this;		
		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="Payment in monthly installments is available.">
				Our payment plan options make securing your season of sailing even easier.
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
					? <React.Fragment>
						<table style={{width: "100%"}}><tbody><tr>
						<td style={{verticalAlign: "top", width: "50%"}}>
							{this.schedulePicker()}
						</td>
						<td style={{verticalAlign: "top", width: "50%"}}>
							{this.scheduleDetail()}
						</td>
					</tr></tbody></table>
					{this.doRenewal ? this.renewalText : null}
					<br />
					Memberships are non-refundable. If you enroll in a monthly installment plan you agree and authorize Community Boating, Inc. 
					to charge your credit card for the agreed upon months. You understand your membership is not active until the final payment is received. 
					It is your responsibility to update your account with any changes to your credit card information. 
					If you cancel this agreement or do not complete all required payments the amount paid will be transferred to a Community Boating gift certificate.
					<br />
					<br />
					<span style={{fontWeight: "bold", color: "#F00"}}>PLEASE NOTE: Your membership will not activate until all payments have been successfully processed.</span>
					</React.Fragment>

					: null
				}
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={self.props.goPrev}/>
			{self.state.radio == "No" || (self.state.selectedNumberPayments && self.state.selectedNumberPayments.isSome())
				? <FactaButton text="Next >" spinnerOnClick onClick={() => {
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
		</FactaMainPage>
	}
}