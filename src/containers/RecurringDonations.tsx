import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import Button from "../components/Button";
import JoomlaArticleRegion from "../theme/joomla/JoomlaArticleRegion";
import JoomlaMainPage from "../theme/joomla/JoomlaMainPage";
import { none } from 'fp-ts/lib/Option';
import { setCheckoutImage } from '../util/set-bg-image';
import { jpBasePath } from '../app/paths/jp/_base';
import assertNever from '../util/assertNever';
import { apBasePath } from '../app/paths/ap/_base';
import { PageFlavor } from '../components/Page';
import StripeElement from '../components/StripeElement';
import { PaymentMethod } from '../models/stripe/PaymentMethod';
import {postWrapper as storePaymentMethod} from "../async/stripe/store-payment-method"
import { makePostJSON } from '../core/APIWrapperUtil';
import {resultValidator as getRecurringInfoValidator} from "../async/stripe/get-recurring-info"

type RecurringDonationInfo = t.TypeOf<typeof getRecurringInfoValidator>;

type Props = {
	history: History<any>,
	program: PageFlavor,
	recurringDonationInfo: RecurringDonationInfo
}

export default class RecurringDonations extends React.PureComponent<Props> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: {
				email: none
			},
			validationErrors: []
		}
	}
	render() {
		const self = this;
		console.log(this.props.recurringDonationInfo)
		const havePayment = this.props.recurringDonationInfo.defaultPaymentId.isSome();

		const basePath = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return apBasePath.getPathFromArgs({});
			case PageFlavor.JP:
				return jpBasePath.getPathFromArgs({});			
			default:
				assertNever(self.props.program)
			}
		}());

		const stripeElement = <StripeElement
			submitMethod="PAYMENT_METHOD"
			formId="recurring-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: PaymentMethod) => {
				storePaymentMethod.send(makePostJSON({
					paymentMethodId: result.paymentMethod.id
				})).then(result => {
					console.log(result)
					if (result.type == "Success") {
						self.props.history.push("/redirect" + window.location.pathname)
					}
				})
			}}
		/>;

		const addPaymentMessage = "To create one, first add a new Payment Method below."

		const newDonationRegion = <JoomlaArticleRegion title="Add Recurring Donation">
			You currently have no active recurring donations.{havePayment ? "" : addPaymentMessage}
		</JoomlaArticleRegion>

		return <JoomlaMainPage setBGImage={setCheckoutImage}>
			<JoomlaArticleRegion title="Active Monthly Donations">
				You currently have no active recurring donations.{havePayment ? "" : addPaymentMessage}
			</JoomlaArticleRegion>
			{havePayment ? newDonationRegion : null}
			<JoomlaArticleRegion title={(havePayment ? "Update " : "Add ") + "Payment Method"}>
				{
					havePayment
					? <React.Fragment>You already have a credit card stored; complete the following to replace it with a new one.<br /><br /></React.Fragment>
					: null
				}
				{stripeElement}
			</JoomlaArticleRegion>
			<Button text="< Back" onClick={() => Promise.resolve(self.props.history.push(basePath))}/>
		</JoomlaMainPage>
	}
}
