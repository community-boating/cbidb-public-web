import { History } from 'history';
import * as React from "react";

import { setAPImage, setCheckoutImage, setJPImage } from 'util/set-bg-image';
import { PageFlavor } from 'components/Page';
import { Payment, PaymentList } from 'async/member/open-order-details-ap';
import StandardReport from 'theme/facta/StandardReport';
import * as moment from 'moment';
import Currency from 'util/Currency';
import { makePostJSON } from 'core/APIWrapperUtil';
import { postWrapper as payInvoiceNow } from "async/member/square/pay-invoice-now"
import { apBasePath } from 'app/paths/ap/_base';
import { jpBasePath } from 'app/paths/jp/_base';
import { Option } from 'fp-ts/lib/Option';
import FactaButton from 'theme/facta/FactaButton';
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import SquarePaymentForm, { getPaymentPropsAsyncNoOrder, SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';


type Props = {
	history: History<any>,
	program: PageFlavor,
	payments: PaymentList,
	juniorId: Option<number>
}

type State = {
	validationErrors: string[]
	paymentPropsAsync?: SquarePaymentFormPropsAsync
}


export default class ManageStaggeredPayments extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props)
		this.state = {
			validationErrors: [],
			paymentPropsAsync: undefined
		}
	}
	componentDidMount(): void {
		getPaymentPropsAsyncNoOrder(this.props.program).then((a) => {
			if(a.type == "Success")
				this.setState(s => ({...s, paymentPropsAsync: a.success}))
			else
				console.log("Failed loading payment props")
		})
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

		const outstandingTotal = Currency.cents(this.props.payments.filter(p => !p.paid).reduce((s, p) => s + p.amountCents, 0))

		console.log(this.props.payments[0])

		const clickPayAll = () => {
			const confirmText =
				"This will immediately charge your default credit card on file in the amount of " + 
				outstandingTotal.format() + " and complete your membership purchase(s); do you wish to continue? (You can change the default card under the saved cards tab below)";
			const finishOrder = () => payInvoiceNow.send(makePostJSON({
				orderAppAlias: this.props.program,
				invoiceId: this.props.payments[0].squareInvoiceId
			}))

			if (confirm(confirmText)) {
				return finishOrder().then(r => {
					//We will wait 6 seconds for the webhooks and stuff to balance out (hopefully thats long enough, if not they gonna have to reload)
					if (r.type == "Success") {
						setTimeout(() => {
							self.props.history.push("/redirect" + window.location.pathname)
						}, 6000)
					} else {
						self.setState(s => ({
							...s,
							validationErrors: [r.message]
						}))
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

		const paymentElement = this.state.paymentPropsAsync == undefined ? <h3>Payment Loading...</h3> : <SquarePaymentForm {...this.state.paymentPropsAsync} intentOverride="STORE" orderAppAlias={this.props.program} handleSuccess={() => {}}
		setPaymentErrors={(errors) => {
			this.setState((s) => ({...s, validationErrors: errors}))
		}}/>

		return <FactaMainPage setBGImage={setBGImage} errors={this.state.validationErrors}>
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
				{<table><tbody><tr>
					<td><b>Total Outstanding: {outstandingTotal.format()}</b></td>	
					<td style={{paddingLeft: "10px"}}><FactaButton text="Pay All" onClick={clickPayAll} spinnerOnClick/></td>
				</tr></tbody></table>}
			</FactaArticleRegion>
			<FactaArticleRegion title="Update Payment Method">
				{ paymentElement }
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
