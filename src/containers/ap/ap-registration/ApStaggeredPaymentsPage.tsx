import { none, some } from "fp-ts/lib/Option";
import { History } from "history";
import * as React from "react";
import * as t from 'io-ts';
import * as Sentry from '@sentry/browser';
import * as moment from 'moment';
import * as _ from 'lodash';

import Button from "../../../components/Button";
import { RadioGroup } from "../../../components/InputGroup";
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

export default class ApStaggeredPaymentsPage extends React.Component<Props, {radio: string}> {
	constructor(props: Props) {
		super(props);
		this.state = {
			radio: null
		}
	}
	render() {
		const self = this;

		const schedule = this.props.paymentSchedules.find(e => e.membershipTypeId == this.props.membershipTypeId);
		if (null == schedule || null == schedule.payments || schedule.payments.length == 0) {
			Sentry.captureMessage("Loaded payment stagger page, but no schedule found for typeId " + this.props.membershipTypeId);
			this.props.goNext();
		}

		const payments = schedule.payments;
		console.log(payments)
		
		return <JoomlaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			<JoomlaArticleRegion title="Payment in monthly installments is available.">
				Text describing montly payments here.<br />
				<br />
				<JoomlaReport
					headers={["Date", "Amount"]}
					cellStyles={[{textAlign: "right"}, {textAlign: "right"}]}
					rows={payments.map((p) => 
						[
							<span>{moment(p.paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY")}</span>,
							Currency.cents(p.paymentAmountCents).format()
						]
					).concat([[
						<b>Total</b>,
						<b>{Currency.cents(payments.reduce((sum, p) => sum + p.paymentAmountCents, 0)).format()}</b>
					]])}
				/>
			</JoomlaArticleRegion>
			<JoomlaNotitleRegion>
				<RadioGroup
					id="accept"
					label=""
					columns={1}
					values={[{
						key: "Yes",
						display: `I elect to pay the full price of my membership today.`
					}, {
						key: "No",
						display: "I want to pay in the installments listed above.  I understand that all payments are non-refundable."
					}]}
					updateAction={(id: string, radio: string) => {
						self.setState({
							radio
						})
					}}
					value={self.state ? some(self.state.radio) : none}
					justElement={true}
				/>
			</JoomlaNotitleRegion>
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