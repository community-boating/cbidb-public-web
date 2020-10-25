import { none, some, Option } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';
import * as Sentry from '@sentry/browser';
import * as moment from 'moment';
import * as _ from 'lodash';

import Button from "../../../components/Button";
import JoomlaArticleRegion from "../../../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../../../theme/joomla/JoomlaMainPage";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import NavBarLogoutOnly from "../../../components/NavBarLogoutOnly";
import { setAPImage } from "../../../util/set-bg-image";
import {paymentsScheduleValidator} from "../../../async/member-welcome-ap"
import Currency from "../../../util/Currency";
import JoomlaReport from "../../../theme/joomla/JoomlaReport";

type PaymentSchedule = t.TypeOf<typeof paymentsScheduleValidator>;

interface Props {
	membershipTypeId: number,
	paymentSchedules: PaymentSchedule[],
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
	getSchedulesObject() {
		const schedulesObject = this.props.paymentSchedules.find(e => e.membershipTypeId == this.props.membershipTypeId);
		if (null == schedulesObject || null == schedulesObject.schedules || schedulesObject.schedules.length == 0) {
			Sentry.captureMessage("Loaded payment stagger page, but no schedules found for typeId " + this.props.membershipTypeId);
			this.props.goNext();
			return;
		}

		return schedulesObject.schedules;
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
		const schedules = this.getSchedulesObject();
		return <JoomlaReport
			headers={["Payments", "Monthly Amount", "Final Payment"]}
			cellStyles={[{textAlign: "right"}, {textAlign: "right"}]}
			rows={schedules.map(s => 
				[
					<span>{getRadio(s.length)}<label htmlFor={`sel_${s.length}`}>{s.length}</label></span>,
					Currency.cents(s[0].paymentAmountCents).format(),
					moment(s[s.length-1].paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY")
				]
			)}
		/>
	}
	scheduleDetail() {
		return this.state.selectedNumberPayments.map(ct => {
			const schedules = this.getSchedulesObject();

			console.log(schedules)

			const schedule = schedules[ct - 1]
			return <JoomlaReport
				headers={["Date", "Amount"]}
				cellStyles={[{textAlign: "right"}, {textAlign: "right"}]}
				rows={schedule.map((p) => 
					[
						<span>{moment(p.paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY")}</span>,
						Currency.cents(p.paymentAmountCents).format()
					]
				).concat([[
					<b>Total</b>,
					<b>{Currency.cents(schedule.reduce((sum, p) => sum + p.paymentAmountCents, 0)).format()}</b>
				]])}
			/>;
		}).getOrElse(null);
	}
	render() {
		const self = this;		
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Payment in monthly installments is available.">
				Text describing montly payments here.<br />
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
			{(self.state || {} as any).radio != undefined ? <Button text="Next >" spinnerOnClick onClick={() => {
				return self.props.goNext();
				// return submit.send(makePostJSON({
				// 	wantIt: self.state.radio == "Yes"
				// })).then(res => {
				// 	if (res.type == "Success") {
				// 		self.props.goNext()
				// 	} else {
				// 		window.scrollTo(0, 0);
				// 	}
				// })
			}}/> : ""}
		</JoomlaMainPage>
	}
}