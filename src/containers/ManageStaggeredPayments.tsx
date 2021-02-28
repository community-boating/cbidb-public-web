import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";

import { setAPImage, setJPImage } from '../util/set-bg-image';
import { PageFlavor } from '../components/Page';
import assertNever from '../util/assertNever';
import { paymentValidator, validator } from '../async/member/open-order-details-ap';
import JoomlaReport from '../theme/joomla/JoomlaReport';
import * as moment from 'moment';
import Currency from '../util/Currency';
import StripeElement from '../components/StripeElement';
import { PaymentMethod } from '../models/stripe/PaymentMethod';
import {postWrapper as storePaymentMethod} from "../async/stripe/store-payment-method-ap"
import { makePostJSON } from '../core/APIWrapperUtil';
import JoomlaMainPage from '../theme/joomla/JoomlaMainPage';
import Button from '../components/Button';
import {postWrapper as finishOrder} from "../async/member/finish-open-order-ap"

type Payment = t.TypeOf<typeof paymentValidator>
type PaymentList = t.TypeOf<typeof validator>


type Props = {
	history: History<any>,
	program: PageFlavor,
	payments: PaymentList
}


export default class ManageStaggeredPayments extends React.PureComponent<Props> {
	render() {
		const self = this;
		const setBGImage = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return setAPImage;
			case PageFlavor.JP:
				return setJPImage;
			default:
				assertNever(self.props.program);
				return null;
			}
		}());

		const stripeElement = <StripeElement
			submitMethod="PAYMENT_METHOD"
			formId="recurring-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: PaymentMethod) => {
				return storePaymentMethod.send(makePostJSON({
					paymentMethodId: result.paymentMethod.id
				})).then(result => {
					console.log(result)
					if (result.type == "Success") {
						self.props.history.push("/redirect" + window.location.pathname)
					}
				})
			}}
		/>;

		const outstandingTotal = Currency.cents(this.props.payments.filter(p => !p.paid).reduce((s, p) => s + p.amountCents, 0))

		const clickPayAll = () => {
			const confirmText =
				"This will immediately charge your credit card on file in the amount of " + 
				outstandingTotal.format() + " and complete your membership purchase; do you wish to continue?";

			if (confirm(confirmText)) {
				return finishOrder.send(makePostJSON({})).then(r => {
					self.props.history.push("/redirect" + window.location.pathname)
				})
			} else return Promise.resolve();
		}

		return <JoomlaMainPage setBGImage={setBGImage}>
			<JoomlaArticleRegion title="Upcoming Payments">
				<JoomlaReport
					headers={["Date", "Amount", "Status"]}
					rows={this.props.payments.map((p: Payment) => {
						return [
							moment(p.expectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
							Currency.cents(p.amountCents).format(),
							p.paid ? "Paid" : "Unpaid"
						]
					})}
				/>
				<br /><br />
				<table><tbody><tr>
					<td><b>Total Outstanding: {outstandingTotal.format()}</b></td>	
					<td style={{paddingLeft: "10px"}}><Button text="Pay All" onClick={clickPayAll} spinnerOnClick/></td>
				</tr></tbody></table>
			</JoomlaArticleRegion>
			<JoomlaArticleRegion title="Update Payment Method">
				{stripeElement}
			</JoomlaArticleRegion>
		</JoomlaMainPage>
	}
}
