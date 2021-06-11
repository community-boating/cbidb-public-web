import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import FactaMainPage from "@facta/FactaMainPage";
import { setCheckoutImage } from '@util/set-bg-image';
import { jpBasePath } from '@paths/jp/_base';
import { apBasePath } from '@paths/ap/_base';
import { PageFlavor } from '@components/Page';
import FactaButton from '@facta/FactaButton';
import FactaArticleRegion from '@facta/FactaArticleRegion';
import {validator as getRecurringDonationsValidator} from "@async/member/recurring-donations";
import { validator as donationFundsValidator } from '@async/donation-funds';
import Currency from '@util/Currency';
import StripeConfirm from '@components/StripeConfirm';
import { postWrapper as clearCard } from '@async/stripe/clear-card'
import { makePostJSON } from '@core/APIWrapperUtil';
import StripeElement from '@components/StripeElement';
import { PaymentMethod } from '@models/stripe/PaymentMethod';
import {postWrapper as storePaymentMethodAP} from "@async/stripe/store-payment-method-ap"
import { FactaErrorDiv } from '@facta/FactaErrorDiv';
import { apDonateEditPath } from '@paths/ap/donate-edit';
import { validator as donationHistoryValidator} from "@async/member/recurring-donation-history";
import {postWrapper as submitPayment} from "@async/stripe/submit-payment-autodonate"
import StandardReport from '@facta/StandardReport';
import { toMomentFromLocalDate } from '@util/dateUtil';
import { Option } from 'fp-ts/lib/Option';
import { FactaSuccessDiv } from '@facta/FactaSuccessDiv';

type Props = {
	history: History<any>,
	program: PageFlavor,
	currentDonationPlan: t.TypeOf<typeof getRecurringDonationsValidator>,
	fundInfo: t.TypeOf<typeof donationFundsValidator>,
	donationHistory: t.TypeOf<typeof donationHistoryValidator>,
	successMsg: Option<string>,
}

type State = {
	validationErrors: string[]
}

export default class RecurringDonationsSplash extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: []
		}
		if (this.props.donationHistory.nextChargeDate.isNone() && this.props.currentDonationPlan.recurringDonations.length == 0) {
			this.props.history.push(apDonateEditPath.getPathFromArgs({}))
		}
	}
	render() {
		const self = this;

		console.log(window.location);
		

		const basePath = (function() {
			switch (self.props.program) {
			case PageFlavor.AP:
				return apBasePath.getPathFromArgs({});
			case PageFlavor.JP:
				return jpBasePath.getPathFromArgs({});			
			default:
				return null;
			}
		}());

		const createMode = self.props.donationHistory.nextChargeDate.isNone();

		const confirm = this.props.currentDonationPlan.paymentMethod.map(cd => <React.Fragment>
			<StripeConfirm
				cardData={cd}
			/>
			<br />
			<FactaButton text="Update Card" onClick={e => {
				e.preventDefault();
				return clearCard.send(makePostJSON({program: PageFlavor.AUTO_DONATE})).then(() => self.props.history.push(`/redirect${window.location.pathname}`));
			}} />
			{
				createMode
				? <FactaButton text="Submit Donation" spinnerOnClick onClick={e => {
					e.preventDefault();
					return submitPayment.send(makePostJSON({})).then(res => {
						if (res.type == "Success") {
							self.props.history.push(`/redirect${window.location.pathname}?success`);
						} else {
							self.setState({
								...self.state,
								validationErrors: res.message.split("\\n") // TODO
							});
						}
					})
				}} />
				: null
			}
			
		</React.Fragment>);

		const stripeElement = <StripeElement
			submitMethod="PAYMENT_METHOD"
			formId="recurring-form"
			elementId="card-element"
			cardErrorsId="card-errors"
			then={(result: PaymentMethod) => {
				return storePaymentMethodAP.send(makePostJSON({
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

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const buttonText = (
			this.props.currentDonationPlan.recurringDonations.length == 0
			? "Create"
			: "Edit"
		);

		const title = (
			createMode
			? "Monthly Donations to Create"
			: "Active Monthly Donations"
		);

		const createWarning = (
			createMode
			?  <React.Fragment><span style={{color: "red", fontWeight: "bold"}}>
				Your donation has not been processed yet!  Please confirm payment below to complete your donation.
			</span><br /><br /></React.Fragment>
			: null
		);

		const donationHistoryTable = <StandardReport 
			headers={["Date", "Fund", "Amount"]}
			rows={this.props.donationHistory.donationHistory.map(h => [
				toMomentFromLocalDate(h.donatedDate).format("MM/DD/YYYY"),
				self.props.fundInfo.find(f => f.fundId == h.fundId).fundName,
				Currency.dollars(h.amount).format(),
			])}
		/>;

		const success = this.props.successMsg.map(msg => <FactaSuccessDiv msg="Your recurring donation was successfully created!" />).getOrElse(null);

		return <FactaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			{success}
			<table style={{width: "100%"}}><tbody><tr>
				<td style={{verticalAlign: "top", width: "40%"}}>
					<FactaArticleRegion title={title}>
						{(
							self.props.currentDonationPlan.recurringDonations.length == 0
							? <React.Fragment>You currently have no active recurring donations.<br /></React.Fragment>
							: (<React.Fragment>
								{createWarning}
								{this.props.donationHistory.nextChargeDate.map(nd => 
									<React.Fragment><span>Your next donation will automatically occur on {toMomentFromLocalDate(nd).format("MM/DD/YYYY")}.</span><br /><br /></React.Fragment>
								).getOrElse(null)}
								<table cellPadding="5"><tbody>
									<tr><th>Fund Name</th><th>Amount</th></tr>
									{self.props.currentDonationPlan.recurringDonations.map(d => <tr>
										<td>{self.props.fundInfo.find(f => f.fundId == d.fundId).fundName}</td>
										<td style={{textAlign: "right"}}>{Currency.cents(d.amountInCents).format()}</td>
									</tr>)}
								</tbody></table>
							</React.Fragment>)
						)}
						<br />
						<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(basePath))}/>
						<FactaButton text={buttonText} onClick={() => Promise.resolve(self.props.history.push(apDonateEditPath.getPathFromArgs({})))} />
					</FactaArticleRegion>
					{
						this.props.currentDonationPlan.recurringDonations.length == 0
						? null
						: <FactaArticleRegion title="Payment Method">
							{confirm.getOrElse(stripeElement)}
						</FactaArticleRegion>
					}
				</td>
				<td style={{width: "10%"}}></td>
				<td style={{verticalAlign: "top"}}>
					{}
					<FactaArticleRegion title="Donation History">
						{this.props.donationHistory.donationHistory.length > 0 ? donationHistoryTable : "No donations have been made yet."}
					</FactaArticleRegion>
				</td>
			</tr></tbody></table>
		</FactaMainPage>
	}
}
