import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
// import { DonationThirdPartyWidget } from '../../components/DonationThirdPartyWidget';
import { none, Option, some } from 'fp-ts/lib/Option';
import {donationFundValidator} from "../../async/donation-funds"
import TextInput from '../../components/TextInput';
import { RadioGroup } from '../../components/InputGroup';
import { Select } from '../../components/Select';
import formUpdateState from '../../util/form-update-state';
import newPopWin from "../../util/newPopWin";
import {postWrapper as addDonation} from "../../async/add-donation-standalone"
import { makePostJSON, PostURLEncoded } from '../../core/APIWrapperUtil';
import {postWrapper as getProtoPersonCookie} from "../../async/check-proto-person-cookie"
import FullCartReport from '../../components/FullCartReport';
import { CartItem } from '../../async/get-cart-items-donate';
import { PageFlavor } from '../../components/Page';

type DonationFund = t.TypeOf<typeof donationFundValidator>;

type Props = {
	history: History<any>,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	donationFunds: DonationFund[],
	cartItems: CartItem[],
}

type Form = {
	selectedDonationAmount: Option<string>,
	selectedFund: Option<string>,
	otherAmount: Option<string>,
	promoCode: Option<string>,
	gcNumber: Option<string>,
	gcCode: Option<string>,
	inMemory: Option<string>,
}

type State = {
	availableFunds: DonationFund[],
	formData: Form,
	validationErrors: string[],
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

export default class DonateDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props) {
		super(props)
		const fundIsUnused = (fund: t.TypeOf<typeof donationFundValidator>) => {
			return !this.props.cartItems.find(item => item.fundId.getOrElse(null) == fund.fundId)
		}

		const availableFunds = this.props.donationFunds.filter(fundIsUnused)

		this.state = {
			availableFunds,
			formData: {
				selectedDonationAmount: none,
				selectedFund: availableFunds.length > 0 ? some(String(availableFunds[0].fundId)) : none,
				otherAmount: none,
				promoCode: none,
				gcNumber: none,
				gcCode: none,
				inMemory: none,
			},
			validationErrors: [],
		}
	}
	doAddDonation() {
		const self = this;
		return getProtoPersonCookie.send(PostURLEncoded({})).then(() => addDonation.send(makePostJSON({
			fundId: this.state.formData.selectedFund.map(Number).getOrElse(null),
			amount: this.state.formData.selectedDonationAmount.map(Number).getOrElse(null)
		})))
		.then(ret => {
			if (ret.type == "Success") {
				self.props.history.push("/redirect" + window.location.pathname)
			} else {
				window.scrollTo(0, 0);
				self.setState({
					...self.state,
					validationErrors: ret.message.split("\\n") // TODO
				});
			}
		})
	}
	render() {
		const self = this
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const donationAmountCell = (<div>
			How much can you give this season?<br />
			<FormRadio
				id="selectedDonationAmount"
				justElement={true}
				columns={3}
				values={[{
					key: "None",
					display: "None"
				}, {
					key: "10",
					display: "$10"
				}, {
					key: "20",
					display: "$20"
				}, {
					key: "50",
					display: "$50"
				}, {
					key: "75",
					display: "$75"
				}, {
					key: "100",
					display: "$100"
				}, {
					key: "Other",
					display: "Other"
				}]}
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
			<Button text="Add Donation" spinnerOnClick onClick={() => this.doAddDonation()}/>
		</div>)

		const fundCell = (<div>
			How would you like your gift to be used?
			<br />
			<FormSelect	
				id="selectedFund"
				label=""
				value={this.state.formData.selectedFund}
				updateAction={updateState}
				options={this.state.availableFunds.map(fund => ({
					key: String(fund.fundId),
					display: fund.fundName
				}))}
				justElement={true}
			/>&nbsp;&nbsp;
			<a href="#" onClick={() => newPopWin('/funds#funds', 1100, 800)} >Click here for more information about our funds.</a>
		</div>)

		const inMemoryCell = (<div>
			If you would like to make your gift in honor of<br />or in memory of an individual, type their name below:
			<br />
			<FormInput
				id="inMemory"
				value={this.state.formData.inMemory}
				justElement
				updateAction={updateState}
			/>
		</div>)

		const donationRow = this.state.availableFunds.length > 0 ? (<table style={{width: "100%"}}><tbody><tr>
			<td style={{verticalAlign: "top"}}>{donationAmountCell}</td>
			<td style={{verticalAlign: "top"}}>
				<table><tbody>
					<tr><td>{fundCell}</td></tr>
					<tr><td></td></tr>
					<tr><td>{inMemoryCell}</td></tr>
				</tbody></table>
			</td>
		</tr></tbody></table>) : null;

		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Support Community Boating!"}>
					{/* <DonationThirdPartyWidget /> */}
					<br />
					Community Boating, Inc. is a private, 501(c)3 non-profit organization operating affordable and accessible programs
					for kids, adults and individuals with special needs under the mission of 'sailing for all.'
					<br />
					<br />
					You can donate to multiple areas if you wish; simply choose a fund, click "Add Donation," and repeat for as many funds as you like.
					{/* <Button text="< Back" onClick={this.props.goPrev}/>
					<Button text="Next >" spinnerOnClick onClick={this.props.goNext}/> */}
				</JoomlaArticleRegion>
				{donationRow}
				<JoomlaArticleRegion title="Donation Summary">
					<FullCartReport
						cartItems={self.props.cartItems}
						history={this.props.history}
						setErrors={() => {}}
						includeCancel={true}
						pageFlavor={PageFlavor.AP}
					/>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}