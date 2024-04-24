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
import {validator as getRecurringDonationsValidator, postWrapper as setRecurringDonations} from "async/member/recurring-donations";
import { validator as donationFundsValidator } from 'async/donation-funds';
import { Select } from 'components/Select';
import formUpdateState from 'util/form-update-state';
import { RadioGroup } from 'components/InputGroup';
import TextInput from 'components/TextInput';
import Currency from 'util/Currency';
import { Either, left, right } from 'fp-ts/lib/Either';
import { FactaErrorDiv } from 'theme/facta/FactaErrorDiv';
import { apDonatePath } from 'app/paths/ap/donate';
import { validator as donationHistoryValidator} from "async/member/recurring-donation-history";
import { apBasePath } from 'app/paths/ap/_base';

type Props = {
	history: History<any>,
	program: PageFlavor,
	initialDonationPlan: t.TypeOf<typeof getRecurringDonationsValidator>,
	fundInfo: t.TypeOf<typeof donationFundsValidator>,
	donationHistory: t.TypeOf<typeof donationHistoryValidator>,
}

const formDefault = {
	selectedFund: none as Option<string>,
	selectedDonationAmount: none as Option<string>,
	otherAmount: none as Option<string>,
}

type Form = typeof formDefault;

type State = {
	stagedDonationPlan: t.TypeOf<typeof getRecurringDonationsValidator>
	formData: Form,
	formDirty: boolean,
	validationErrors: string[],
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
			stagedDonationPlan: this.props.initialDonationPlan,
			formDirty: false,
			validationErrors: [],
		}
		this.state = {
			...this.state,
			formData: {
				...this.state.formData,
				selectedFund: this.getDefaultFund()
			}
		}
	}
	createMode = this.props.initialDonationPlan.recurringDonations.length == 0;
	componentWillUnmount() {
		undirty();
	}
	goBack() {
		if (this.props.donationHistory.nextChargeDate.isNone() && this.state.stagedDonationPlan.recurringDonations.length == 0) {
			return Promise.resolve(this.props.history.push(apBasePath.getPathFromArgs({})))
		} else {
			return Promise.resolve(this.props.history.push(apDonatePath.getPathFromArgs({})))
		}
	}
	maybeGoPrev() {
		if (this.state.formDirty) {
			if (confirm("Discard changes to recurring donations?")) {
				return this.goBack();
			} else {
				return Promise.resolve();
			}
		} else {
			return this.goBack()
		}
	}
	submit() {
		return setRecurringDonations.sendJson({recurringDonations: this.state.stagedDonationPlan.recurringDonations} as any).then(res => {
			if (res.type == "Success") {
				if (this.state.stagedDonationPlan.recurringDonations.length == 0) {
					return this.props.history.push(apBasePath.getPathFromArgs({}))
				} else {
					return this.goBack();
				}
				
			}
		})
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
		console.log(newFundNonNull)
		const state = (this.state && this.state.stagedDonationPlan && this.state.stagedDonationPlan.recurringDonations) || [];
		return this.props.fundInfo.filter(f => newFundNonNull.map(nf => nf != String(f.fundId)).getOrElse(true) && state.find(ff => ff.fundId == f.fundId) == null)
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
	addDonation() {
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

		if (self.state.formData.selectedFund.isNone()) {
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
			this.setState({
				...this.state,
				stagedDonationPlan: {
					...this.state.stagedDonationPlan,
					recurringDonations: this.state.stagedDonationPlan.recurringDonations.concat([{
						fundId: Number(this.state.formData.selectedFund.getOrElse(null)),
						amountInCents: errorOrOtherAmt.getOrElse(1)
					}])
				},
				formData: {
					...this.state.formData,
					selectedFund: self.getDefaultFund(self.state.formData.selectedFund),
					selectedDonationAmount: none,
				},
				formDirty: true,
				validationErrors: [],
			});
		}

		return Promise.resolve(null);
	}
	render() {
		const self = this;
		

		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		if (this.state.formDirty) {
			dirty();
		} else {
			undirty();
		}

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
			<div style={{margin: "20px 0"}}><FactaButton text="Add Donation" onClick={this.addDonation.bind(this)}/></div>
		</div>)

		const deleteFund = (fundId: number) => {
			self.setState({
				...self.state,
				stagedDonationPlan: {
					...self.state.stagedDonationPlan,
					recurringDonations: self.state.stagedDonationPlan.recurringDonations.filter(d => d.fundId != fundId)
				},
				formDirty: true
			});
		}

		const editFund = (fundId: number) => {
			const existingAmount = self.state.stagedDonationPlan.recurringDonations.find(d => d.fundId == fundId).amountInCents;
			const amountIsPreset = amounts.find(a => a.key == String(existingAmount)) != null;
			const formDataPiece = (
				amountIsPreset
				? {selectedDonationAmount: some(String(existingAmount)) }
				: {selectedDonationAmount: some("Other"), otherAmount: some(String(existingAmount/100))}
			)
			self.setState({
				...self.state,
				stagedDonationPlan: {
					...self.state.stagedDonationPlan,
					recurringDonations: self.state.stagedDonationPlan.recurringDonations.filter(d => d.fundId != fundId)
				},
				formData: {
					...self.state.formData,
					selectedFund: some(String(fundId)),
					...formDataPiece
				},
				formDirty: true
			});
		}

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setCheckoutImage}>
			{errorPopup}
			<table width="100%"><tbody><tr>
				<td style={{verticalAlign: "top", width: "50%"}}>
					<FactaArticleRegion title="Active Monthly Donations">
						{
							this.state.stagedDonationPlan.recurringDonations.length == 0
							? "No recurring donations yet."
							: (<table cellPadding="5"><tbody>
								<tr><th></th><th>Fund Name</th><th>Amount</th></tr>
								{this.state.stagedDonationPlan.recurringDonations.map((d, i) => <tr key={"row_" + i}>
									<td>
										<a href="#" onClick={() => editFund(d.fundId)}><img style={{height: "20px"}} src="/images/edit.png" /></a>
										&nbsp;&nbsp;
										<a href="#" onClick={() => deleteFund(d.fundId)}><img src="/images/delete.png" /></a></td>
									<td>{self.props.fundInfo.find(f => f.fundId == d.fundId).fundName}</td>
									<td>{Currency.cents(d.amountInCents).format()}</td>
								</tr>)}
							</tbody></table>)
						}
						<br /><br />
						<FactaButton text="< Cancel" onClick={this.maybeGoPrev.bind(this)}/>
						{(
							this.state.formDirty
							? <FactaButton text="Save Changes" onClick={this.submit.bind(this)}/>
							: null
						)}
						
					</FactaArticleRegion>	
				</td>
				<td style={{verticalAlign: "top"}}>
					<FactaArticleRegion title="Add Donation">
						Fund:&nbsp;&nbsp;&nbsp;&nbsp;
						<FormSelect	
							id="selectedFund"
							label=""
							value={this.state.formData.selectedFund}
							updateAction={updateState}
							options={this.getAvailableFunds()}
							nullDisplay="- Select a fund -"
							justElement={true}
						/>
						{donationAmountCell}
					</FactaArticleRegion>
				</td>
			</tr></tbody></table>
		</FactaMainPage>
	}
}
