import { History } from 'history';
import * as React from "react";
import * as t from 'io-ts';

import FactaMainPage from "theme/facta/FactaMainPage";
import { none, Option, some } from 'fp-ts/lib/Option';
import { setCheckoutImage } from 'util/set-bg-image';
// import { jpBasePath } from 'app/paths/jp/_base';
// import { apBasePath } from 'app/paths/ap/_base';
import { PageFlavor } from 'components/Page';
import { makePostJSON } from 'core/APIWrapperUtil';
import FactaButton from 'theme/facta/FactaButton';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import {RecurringDonationData} from "async/member/square/get-recurring-donations"
import { validator as donationFundsValidator } from 'async/donation-funds';
import { getWrapper as updateRecurringDonation } from 'async/member/square/update-recurring-donation';
import { getWrapper as deleteRecurringDonation } from 'async/member/square/delete-recurring-donation';
import { Select } from 'components/Select';
import formUpdateState from 'util/form-update-state';
import { RadioGroup } from 'components/InputGroup';
import TextInput from 'components/TextInput';
import Currency from 'util/Currency';
import { Either, left, right } from 'fp-ts/lib/Either';
import { apDonatePath } from 'app/paths/ap/donate';
import { validator as donationHistoryValidator} from "async/member/recurring-donation-history";
import { apBasePath } from 'app/paths/ap/_base';
import SquarePaymentForm, { getPaymentPropsAsync, SquarePaymentFormPropsAsync } from 'components/SquarePaymentForm';
import {postWrapper as addDonation} from "async/member/add-donation"
import { CartItem } from 'async/get-cart-items-donate';
import FullCartReport from 'components/FullCartReport';

type RecurringDontionType = t.TypeOf<typeof RecurringDonationData>

type Props = {
	history: History<any>,
	program: PageFlavor,
	existingDonations: RecurringDontionType[],
	cartItems: CartItem[]
	fundInfo: t.TypeOf<typeof donationFundsValidator>,
	donationHistory: t.TypeOf<typeof donationHistoryValidator>,
}

const formDefault = {
	selectedDonationId: none as Option<number>,
	selectedDonationAmount: none as Option<string>,
	selectedFundId: none as Option<string>,
	otherAmount: none as Option<string>,
	inMemoryOf: none as Option<string>
}

type Form = typeof formDefault;

type State = {
	donations: RecurringDontionType[]
	formData: Form
	formDirty: boolean
	validationErrors: string[]
	paymentPropsAsync: SquarePaymentFormPropsAsync
}

class FormSelect extends Select<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormInput extends TextInput<Form> {}

const amounts = [{
	key: "1000",
	display: "$10"
}, {
	key: "2000",
	display: "$20"
}, {
	key: "5000",
	display: "$50"
}, {
	key: "7500",
	display: "$75"
}, {
	key: "10000",
	display: "$100"
}, {
	key: "Other",
	display: "Other"
}];

function dirty() {
	console.log("dirtying");
	window.onbeforeunload = function() {
		return "You have unsaved changes!";
	}
}

function undirty() {
	// window.addEventListener('beforeunload', function (e) {
	// 	// the absence of a returnValue property on the event will guarantee the browser unload happens
	// 	delete e['returnValue'];
	// });
	console.log("undirtying");
	(window.onbeforeunload as any) = '';
}

export default class RecurringDonationsEdit extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: formDefault,
			donations: props.existingDonations,
			formDirty: false,
			validationErrors: [],
			paymentPropsAsync: undefined
		}
		this.state = {
			...this.state,
			formData: {
				...this.state.formData,
				selectedDonationId: none
			}
		}
	}
	componentDidMount() {
		getPaymentPropsAsync(PageFlavor.AUTO_DONATE).then((a) => {
			if(a.type == "Success")
				this.setState(s => ({...s, paymentPropsAsync: a.success}))
			else
				console.log("Failed loading payment props")
		})
	}
	createMode = this.props.existingDonations.length == 0;
	componentWillUnmount() {
		undirty();
	}
	goBack() {
		if (this.props.donationHistory.nextChargeDate.isNone() && this.state.donations.length == 0) {
			return Promise.resolve(this.props.history.push(apBasePath.getPathFromArgs({})))
		} else {
			return Promise.resolve(this.props.history.push(apDonatePath.getPathFromArgs({})))
		}
	}
	maybeGoPrev() {
		/*if (this.state.formDirty) {
			if (confirm("Discard changes to recurring donations?")) {
				return this.goBack();
			} else {
				return Promise.resolve();
			}
		} else {*/
			return this.goBack()
		//}
	}
	validateDonationOtherAmt(): Either<string, number> {
		if (this.state.formData.selectedDonationAmount.getOrElse(null) != "Other") {
			return right(null);
		} else {
			const rawAmt = this.state.formData.otherAmount.getOrElse("");
			const removeDollarSignAndCommas = Number(rawAmt.replace(/\$/g, "").replace(/,/g, ""));
			if (isNaN(removeDollarSignAndCommas)) {
				return left("Donation amount is invalid."); 
			} else {
				return right(Currency.dollars(removeDollarSignAndCommas).cents);
			}
		}
	}
	getAvailableFunds(newFund?: Option<string>) {
		const newFundNonNull = newFund || none;
		const donations = (this.state && this.state.donations) || [];
		console.log(donations)
		return this.props.fundInfo//.filter(f => newFundNonNull.map(nf => nf != String(f.fundId)).getOrElse(true) && donations.find(ff => ff.donationData.fundId == f.fundId) == null)
			.map(fund => ({
				key: String(fund.fundId),
				display: fund.fundName
			}));
	}
	getDefaultFund(newFund?: Option<string>) {
		const availableFunds = this.getAvailableFunds(newFund);
		console.log(availableFunds)
		return availableFunds.length > 0 ? some(availableFunds[0].key) : none;
	}
	addDonation(): Promise<any> {
		const self = this;
		// TODO: handle error
		const errorOrOtherAmt: Either<string, number> = (function() {
			const selectedAmount = self.state.formData.selectedDonationAmount.getOrElse("None");
			if (selectedAmount == "None") {
				return left("No donation amount selected.") as Either<string, number>
			} else if (selectedAmount == "Other") {
				return self.validateDonationOtherAmt();
			} else {
				return right(Number(selectedAmount)) as Either<string, number>
			}
		}());

		if (self.state.formData.selectedFundId.isNone()) {
			this.setState({
				...this.state,
				validationErrors: ["Please select a fund to donate to."]
			});
		} else if (errorOrOtherAmt.isLeft()) {
			this.setState({
				...this.state,
				validationErrors: [errorOrOtherAmt.swap().getOrElse("")]
			});
		} else {
			return addDonation.send(makePostJSON({
				fundId: parseInt(this.state.formData.selectedFundId.getOrElse("")),
				amount: self.getPriceNew(undefined, false) / 100,
				program: PageFlavor.AUTO_DONATE,
				inMemoryOf: self.state.formData.inMemoryOf.getOrElse(undefined)
			})).then((a) => {
				if(a.type == "Success"){
					self.props.history.push("/redirect" + window.location.pathname);
					return Promise.resolve()
				}else{
					self.setState(s => ({...s, validationErrors: ["Failed to add donation"]}))
					return Promise.reject()
				}
			})
			//TODO fix this
			/*updateRecurringDonation.send(makePostJSON({
				orderAppAlias: PageFlavor.AP,
				recurringDonationId: 0,
				data: null,
				updatePayment: false
			})).then((a) => {

			})*/
		}

		return Promise.resolve(null);
	}
	getPriceNew(existingDonation?: RecurringDontionType, convert: boolean = true){
		const selectedPrice = this.state.formData.selectedDonationAmount.getOrElse("Other")
		const otherPrice = parseInt(this.state.formData.otherAmount.getOrElse(((existingDonation || {donationData: {price: 0}}).donationData.price/100).toString())) * 100
		return selectedPrice == "Other" ? otherPrice : parseInt(selectedPrice)
	}
	saveDonation(){
		const self = this
		const donationId = self.state.formData.selectedDonationId.getOrElse(undefined)
		const existingDonation = self.state.donations.find(d => d.recurringDonationId == donationId)
		if(existingDonation == undefined){
			console.log(self.state.donations)
			console.log(donationId)
			console.log("Returning")
			return Promise.reject()
		}
		const priceNew = self.getPriceNew(existingDonation)
		const fundIdNew = parseInt(self.state.formData.selectedFundId.getOrElse(existingDonation.donationData.fundId.toString()))
		const inMemoryOfNew = self.state.formData.inMemoryOf.getOrElse(existingDonation.donationData.inMemoryOf)
		return updateRecurringDonation.send(makePostJSON({
			orderAppAlias: PageFlavor.AP,
			data: {...existingDonation.donationData,
				price: priceNew,
				fundId: fundIdNew,
				inMemoryOf: inMemoryOfNew
			},
			recurringDonationId: donationId,
			updatePayment: false
		})).then((a) => {
			if(a.type == "Success"){
				self.setState({
					...self.state,
					donations: self.state.donations.filter(a => a.recurringDonationId != donationId).concat([a.success])
				})
		}else{
			self.setState({
				...self.state,
				validationErrors: ["Failed to update donation"]
			})
		}
		return Promise.resolve()
		})
	}
	render() {
		const self = this;
		

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		// const basePath = (function() {
		// 	switch (self.props.program) {
		// 	case PageFlavor.AP:
		// 		return apBasePath.getPathFromArgs({});
		// 	case PageFlavor.JP:
		// 		return jpBasePath.getPathFromArgs({});			
		// 	default:
		// 		return null;
		// 	}
		// }());

		const ifAdding = <tr><td><FactaArticleRegion title="Donations to add"><FullCartReport
							cartItems={self.props.cartItems}
							history={this.props.history}
							setErrors={() => {}}
							includeCancel={true}
							excludeMemberName={true}
							pageFlavor={PageFlavor.AUTO_DONATE}
						/></FactaArticleRegion></td></tr>

		const addDonationButton = <FactaButton text="Add Donation" spinnerOnClick onClick={this.addDonation.bind(this)}/>

		const paymentElement = this.state.paymentPropsAsync == undefined ? <h3>Payment Loading...</h3> : <SquarePaymentForm {...self.state.paymentPropsAsync} updateRecurringDonations orderAppAlias={PageFlavor.AUTO_DONATE} handleSuccess={function (): void {
			self.props.history.push("/redirect" + window.location.pathname);
		} } setPaymentErrors={function (errors: string[]): void {
			self.setState(s => ({...s, validationErrors: errors}));
		} }/>

		const updateDonationButton = <FactaButton text="Update Donation" spinnerOnClick onClick={this.saveDonation.bind(this)}/>
		
		const donationAmountCell = (<div>
			How much can you give this season?<br />
			<FormRadio
				id="selectedDonationAmount"
				justElement={true}
				columns={3}
				values={amounts}
				updateAction={updateState}
				value={this.state.formData.selectedDonationAmount || none}
			/>
			{
				(this.state.formData.selectedDonationAmount.getOrElse(null) == "Other")
				? 
				<FormInput
					id="otherAmount"
					label="$"
					value={this.state.formData.otherAmount}
					updateAction={updateState}
					size={10}
					maxLength={10}
				/>
				: null
			}
			<FormInput
						id="inMemoryOf"
						label="In Memory Of"
						value={this.state.formData.inMemoryOf}
						updateAction={updateState}
						size={38}
						maxLength={500}
					/>
			<div style={{margin: "20px 0"}}>{self.state.formData.selectedDonationId.isSome() ? updateDonationButton : addDonationButton}</div>
		</div>)

		const deleteDonation = (donationId: number) => {
			return deleteRecurringDonation.send(makePostJSON({
				orderAppAlias: PageFlavor.AP,
				recurringDonationId: donationId
			})).then((a) => {
				if(a.type == "Success"){
					self.setState({
						...self.state,
						donations: self.state.donations.filter(a => a.recurringDonationId != donationId),
						formData: {...self.state.formData, selectedDonationId: none}
					});
				}else{
					self.setState({
						...self.state,
						validationErrors: ["Failed to delete donation"]
					});
				}
				return Promise.resolve()
			})
		}

		const editDonation = (donationId: number) => {
			const existingDonation = self.state.donations.find(d => d.recurringDonationId == donationId)
			if(existingDonation == undefined){
				return
			}
			const existingFundId = (existingDonation.donationData || {}).fundId
			const existingAmount = (existingDonation.donationData || {}).price
			const existingInMemoryOf = (existingDonation.donationData || {}).inMemoryOf
			const amountIsPreset = amounts.find(a => a.key == String(existingAmount)) != null;
			const formDataPiece = (
				amountIsPreset
				? {selectedDonationAmount: some(String(existingAmount)) }
				: {selectedDonationAmount: some("Other"), otherAmount: some(String(existingAmount/100))}
			)
			console.log(existingFundId)
			console.log(this.getAvailableFunds())
			
			self.setState({
				...self.state,
				formData: {
					...self.state.formData,
					selectedDonationId: some(donationId),
					selectedFundId: existingFundId ? some(existingFundId.toString()) : none,
					inMemoryOf: existingInMemoryOf ? some(existingInMemoryOf) : none,
					...formDataPiece
				},
				formDirty: true
			});
				
			
		}

		console.log(self.state)

		return <FactaMainPage setBGImage={setCheckoutImage} errors={this.state.validationErrors}>
			<table width="100%"><tbody><tr>
				<td style={{verticalAlign: "top", width: "50%"}}>
					<FactaArticleRegion title="Active Monthly Donations">
						{
							this.state.donations.length == 0
							? "No recurring donations yet."
							: (<table cellPadding="5"><tbody>
								<tr><th></th><th>Fund Name</th><th>In Memory Of</th><th>Amount</th></tr>
								{this.state.donations.map((d, i) => <tr key={"row_" + i}>
									<td>
										<a href="#" onClick={() => editDonation(d.recurringDonationId)}><img style={{height: "20px"}} src="/images/edit.png" /></a>
										&nbsp;&nbsp;
										<a href="#" onClick={() => deleteDonation(d.recurringDonationId)}><img src="/images/delete.png" /></a></td>
									<td>{self.props.fundInfo.find(f => f.fundId == d.donationData.fundId).fundName}</td>
									<td>{d.donationData.inMemoryOf}</td>
									<td>{Currency.cents(d.donationData.price).format()}</td>
								</tr>)}
							</tbody></table>)
						}
						<br />
					</FactaArticleRegion>
				</td>
				<td style={{verticalAlign: "top"}}>
					<FactaArticleRegion title="Update Donation">
						Fund:&nbsp;&nbsp;&nbsp;&nbsp;
						<FormSelect	
							id="selectedFundId"
							label=""
							value={self.state.formData.selectedFundId}
							updateAction={updateState}
							options={this.getAvailableFunds()}
							nullDisplay="-"
							justElement={true}
						/>
						{donationAmountCell}
					</FactaArticleRegion>
				</td>
			</tr>
			{self.props.cartItems.length > 0 ? ifAdding : <></>}
			</tbody></table>
			<FactaArticleRegion title="Payment Method">
				<br />
				<br />
				{ paymentElement }
				<br />
				<FactaButton text="< Back" onClick={this.maybeGoPrev.bind(this)}/>
			</FactaArticleRegion>
		</FactaMainPage>
	}
}
