import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import { setAPImage, setCheckoutImage, setJPImage } from 'util/set-bg-image';
import { PageFlavor } from 'components/Page';
import { paymentValidator, validator } from 'async/member/open-order-details-ap';
import StandardReport from 'theme/facta/StandardReport';
import * as moment from 'moment';
import Currency from 'util/Currency';
import StripeElement from 'components/StripeElement';
import { PaymentMethod } from 'models/stripe/PaymentMethod';
import {postWrapper as storePaymentMethodAP} from "async/stripe/store-payment-method-ap"
import {postWrapper as storePaymentMethodJP} from "async/stripe/store-payment-method-jp"
import { makePostJSON } from 'core/APIWrapperUtil';
import {postWrapper as finishOrderAP} from "async/member/finish-open-order-ap"
import {postWrapper as finishOrderJP} from "async/member/finish-open-order-jp"
import { apBasePath } from 'app/paths/ap/_base';
import { jpBasePath } from 'app/paths/jp/_base';
import { Option } from 'fp-ts/lib/Option';
import FactaButton from 'theme/facta/FactaButton';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';

type Payment = t.TypeOf<typeof paymentValidator>
type PaymentList = t.TypeOf<typeof validator>


type Props = {
	history: History<any>,
	program: PageFlavor,
	payments: PaymentList,
	juniorId: Option<number>
}

type State = {
	validationErrors: string[]
}


export default class ManageStaggeredPayments extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props)
		this.state = {
			validationErrors: []
		}
	}
	render() {
		const self = this;
		const setBGImage = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return setAPImage;
			case PageFlavor.JP:
				return setJPImage;
			default:
				return setCheckoutImage;
			}
		}());

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const storePaymentMethod = (
			this.props.program == PageFlavor.JP
			? storePaymentMethodJP(this.props.juniorId)
			: storePaymentMethodAP
		);

		const stripeElement = <StripeElement
			submitMethod="PAYMENT_METHOD"
			formId="recurring-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: PaymentMethod) => {
				return storePaymentMethod.send(makePostJSON({
					paymentMethodId: result.paymentMethod.id,
					retryLatePayments: true
				})).then(result => {
					if (result.type == "Success") {
						self.props.history.push("/redirect" + window.location.pathname)
					} else {
						self.setState({
							...self.state,
							validationErrors: result.message.split("\\n") // TODO
						});
					}
				})
			}}
		/>;

		const outstandingTotal = Currency.cents(this.props.payments.filter(p => !p.paid).reduce((s, p) => s + p.amountCents, 0))

		const clickPayAll = () => {
			const confirmText =
				"This will immediately charge your credit card on file in the amount of " + 
				outstandingTotal.format() + " and complete your membership purchase; do you wish to continue?";

			const finishOrder = (
				self.props.program == PageFlavor.JP && self.props.juniorId.isSome()
				? finishOrderJP(self.props.juniorId.getOrElse(null))
				: finishOrderAP
			)

			if (confirm(confirmText)) {
				return finishOrder.send(makePostJSON({})).then(r => {
					if (r.type == "Success") {
						self.props.history.push("/redirect" + window.location.pathname)
					} else {
						self.setState({
							...self.state,
							validationErrors: [r.message]
						})
					}
					
				})
			} else return Promise.resolve();
		}

		const backRoute = (
			this.props.program == PageFlavor.JP
			? jpBasePath.getPathFromArgs({})
			: apBasePath.getPathFromArgs({})
		)

		const paid = <span style={{color:"#22772d"}}>Paid</span>
		const failed = <span style={{color:"#ff0000"}}>Failed</span>

		return <FactaMainPage setBGImage={setBGImage}>
			{errorPopup}
			<br />
			<FactaButton text="< Back" onClick={() => {
				this.props.history.push(backRoute);
				return Promise.resolve();
			}}/>
			<FactaArticleRegion title="Upcoming Payments">
				<StandardReport
					headers={["Date", "Amount", "Status"]}
					rows={this.props.payments.map((p: Payment) => {
						return [
							moment(p.expectedDate, "YYYY-MM-DD").format("MM/DD/YYYY"),
							Currency.cents(p.amountCents).format(),
							p.paid ? paid : (p.failedCron ? failed : "Unpaid")
						]
					})}
				/>
				<br /><br />
				<table><tbody><tr>
					<td><b>Total Outstanding: {outstandingTotal.format()}</b></td>	
					<td style={{paddingLeft: "10px"}}><FactaButton text="Pay All" onClick={clickPayAll} spinnerOnClick/></td>
				</tr></tbody></table>
			</FactaArticleRegion>
			<FactaArticleRegion title="Update Payment Method">
				{stripeElement}
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
