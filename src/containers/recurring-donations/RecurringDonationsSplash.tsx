import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import FactaMainPage from "theme/facta/FactaMainPage";
import { setCheckoutImage } from 'util/set-bg-image';
import { jpBasePath } from 'app/paths/jp/_base';
import { apBasePath } from 'app/paths/ap/_base';
import { PageFlavor } from 'components/Page';
import FactaButton from 'theme/facta/FactaButton';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import {validator as getRecurringDonationsValidator} from "async/member/recurring-donations";
import { validator as donationFundsValidator } from 'async/donation-funds';
import Currency from 'util/Currency';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import { apDonateEditPath } from 'app/paths/ap/donate-edit';
import { validator as donationHistoryValidator} from "async/member/recurring-donation-history";
import StandardReport from 'theme/facta/StandardReport';
import { toMomentFromLocalDate } from 'util/dateUtil';
import { Option } from 'fp-ts/lib/Option';
import { FactaSuccessDiv } from 'theme/facta/FactaSuccessDiv';
import SquarePaymentForm, { getPaymentPropsAsync, getPaymentPropsAsyncNoOrder, SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';

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
	paymentPropsAsync?: SquarePaymentFormPropsAsync
}

export default class RecurringDonationsSplash extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			validationErrors: [],
			paymentPropsAsync: undefined
		}
		if (this.props.donationHistory.nextChargeDate.isNone() && this.props.currentDonationPlan.recurringDonations.length == 0) {
			this.props.history.push(apDonateEditPath.getPathFromArgs({}))
		}
	}
	componentDidMount(): void {
		getPaymentPropsAsyncNoOrder(PageFlavor.JP).then((a) => {
			if(a.type == "Success")
				this.setState(s => ({...s, paymentPropsAsync: a.success}))
			else
				console.log("Failed loading payment props")
		})
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
				(self.props.fundInfo.find(f => f.fundId == h.fundId) || {fundName: "(discontinued fund)"}).fundName,
				Currency.dollars(h.amount).format(),
			])}
		/>;

		const success = this.props.successMsg.map(msg => <FactaSuccessDiv msg="Your recurring donation was successfully created!" />).getOrElse(null);

		const paymentElement = this.state.paymentPropsAsync == undefined ? <h3>Payment Loading...</h3> : <SquarePaymentForm {...this.state.paymentPropsAsync} intentOverride="STORE" orderAppAlias={this.props.program} handleSuccess={() => {}}
				setPaymentErrors={(errors) => {
					this.setState((s) => ({...s, validationErrors: errors}))
				}}/>

		return <FactaMainPage setBGImage={setCheckoutImage} errors={this.state.validationErrors}>
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
										<td>{(self.props.fundInfo.find(f => f.fundId == d.fundId)|| {fundName: "(discontinued fund)"}).fundName}</td>
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
							{ paymentElement }
						</FactaArticleRegion>
					}
				</td>
				<td style={{width: "10%"}}></td>
				<td style={{verticalAlign: "top"}}>
					<FactaArticleRegion title="Donation History">
						{this.props.donationHistory.donationHistory.length > 0 ? donationHistoryTable : "No donations have been made yet."}
					</FactaArticleRegion>
				</td>
			</tr></tbody></table>
		</FactaMainPage>
	}
}
