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

type SinglePayment = t.TypeOf<typeof singlePaymentValidator>;

interface Props {
	membershipTypeId: number,
	paymentSchedules: SinglePayment[][],
	history: History<any>
	breadcrumb: JSX.Element,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>
}

type State = {
	selectedNumberPayments: Option<number>
}

export default class ApStaggeredPaymentsPage extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			selectedNumberPayments: none
		}
	}
	schedulePicker() {
		const getRadio = (paymentCt: number) => (<input
			type="radio"
			key={`sel_${paymentCt}`}
			id={`sel_${paymentCt}`}
			name={`sel_${paymentCt}`}
			value={paymentCt}
			onChange={(e) => this.setState({ ...this.state, selectedNumberPayments: some(Number(e.target.value))})}
			checked={this.state.selectedNumberPayments.getOrElse(null) == paymentCt}
		/>);
		return <JoomlaReport
			headers={["Payments", "Monthly Amt", "Final Payment", "Total"]}
			cellStyles={[{textAlign: "left"}, {textAlign: "right"}, {textAlign: "right"}, {textAlign: "right"}]}
			rows={this.props.paymentSchedules.map(s => 
				[
					<span>{getRadio(s.length)}<label htmlFor={`sel_${s.length}`}>{s.length}</label></span>,
					Currency.cents(s[0].paymentAmtCents).format(),
					moment(s[s.length-1].paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
					Currency.cents(s.reduce((agg, p) => agg + p.paymentAmtCents, 0)).format()
				]
			)}
		/>
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
				Text describing montly payments here. Emphasize the following points:<br />
				<ul>
					<li>You only keep the renewal rate if you pick a plan that terminates before your membership expires</li>
					<li>If you pick a plan today, but do not complete checkout today, your plan will be automatically updated when you do checkout.  You could lose the renewal rate at that time</li>
				</ul>
				<br />
				<table style={{width: "100%"}}><tbody><tr>
					<td style={{verticalAlign: "top", width: "50%"}}>
						{this.schedulePicker()}
					</td>
					<td style={{verticalAlign: "top", width: "50%"}}>
						{this.scheduleDetail()}
					</td>
				</tr></tbody></table>
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={self.props.goPrev}/>
			{self.state && self.state.selectedNumberPayments && self.state.selectedNumberPayments.isSome()
				? <Button text="Next >" spinnerOnClick onClick={() => {
					return submit.send(makePostJSON({
						additionalPayments: self.state.selectedNumberPayments.getOrElse(1)-1
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