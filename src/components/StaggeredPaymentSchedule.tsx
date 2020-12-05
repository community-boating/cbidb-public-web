import * as React from "react";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import moment = require("moment");
import Currency from "../util/Currency";

type Props = {
	schedule: {paymentDate: string, paymentAmtCents: number}[]
}

export const StaggeredPaymentSchedule = (props: Props) => {
	return <JoomlaReport
	headers={["Date", "Amount"]}
	cellStyles={[{textAlign: "right"}, {textAlign: "right"}]}
	rows={props.schedule.map((p, i) => {
		const date = moment(p.paymentDate, "YYYY-MM-DD").format("MM/DD/YYYY");
		return [
			<span>{i == 0 ? `Initial Charge (${date})` : date}</span>,
			Currency.cents(p.paymentAmtCents).format()
		]
	}
		
	).concat([[
		<b>Total</b>,
		<b>{Currency.cents(props.schedule.reduce((sum, p) => sum + p.paymentAmtCents, 0)).format()}</b>
	]])}
/>;
}
