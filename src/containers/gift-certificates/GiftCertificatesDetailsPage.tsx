import * as React from 'react';
import * as t from 'io-ts';
import JoomlaMainPage from '../../theme/joomla/JoomlaMainPage';
import JoomlaArticleRegion from '../../theme/joomla/JoomlaArticleRegion';
import { setCheckoutImage } from '../../util/set-bg-image';
import Button from '../../components/Button';
import {validator as pricesValidator} from "../../async/prices"
import JoomlaReport from '../../theme/joomla/JoomlaReport';
import { MAGIC_NUMBERS } from '../../app/magicNumbers';
import Currency from '../../util/Currency';
import { none, Option } from 'fp-ts/lib/Option';
import TextInput from '../../components/TextInput';
import formUpdateState from '../../util/form-update-state';
import { RadioGroup } from '../../components/InputGroup';

type Prices = t.TypeOf<typeof pricesValidator>;

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	prices: Prices,
}

enum DeliveryMethod {
	Email="Email",
	Mail="Mail",
	Pickup="Pickup"
}

type Form = {
	certAmount: Option<string>,
	purchaserFirstName: Option<string>,
	purchaserLastName: Option<string>,
	purchaserEmail: Option<string>,
	recipientFirstName: Option<string>,
	recipientLastName: Option<string>,
	deliveryMethod: Option<string>
}

type State = {
	formData: Form
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}

export default class GiftCertificatesDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			formData: {
				certAmount: none,
				purchaserFirstName: none,
				purchaserLastName: none,
				purchaserEmail: none,
				recipientFirstName: none,
				recipientLastName: none,
				deliveryMethod: none,
			}
		};
	}
	getPriceForId(id: number){
		return Currency.dollars(this.props.prices.memberships.find(m => m.membershipId == id).membershipBasePrice).format()
	}
	renderRow(item: string, price: string) {
		return <table style={{width: "100%"}}><tbody><tr>
			<td style={{textAlign: "left", paddingRight:"10px"}}>{item}</td>
			<td style={{textAlign: "right", fontWeight: "bold"}}>{price}</td>
		</tr></tbody></table>
	}
	render() {
		const self = this
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");
		const memRows = [
			["Full Year Membership", MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.FULL_YEAR],
			["60-Day Boating Pass", MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_60_DAY],
			["30-Day Intro to Sailing & Paddling", MAGIC_NUMBERS.MEMBERSHIP_TYPE_ID.MEM_30_DAY],
		].map(([typeName, id]: [string, number]) => [this.renderRow(typeName, this.getPriceForId(id))]);

		const inPersonText = <span>
			No further information is required. However, if you plan on giving this as a present for the holiday season,
			pick-up will be available from December 15th to 19th during general business hours (please call or e-mail to confirm availability).
			After December 19th until the New Year, pick-up availability may be limited and must be confirmed prior to pick-up.
			If you require immediate pick-up, purchasing a gift certificate to be e-mailed is highly recommended.
		</span>
		return (
			<JoomlaMainPage setBGImage={setCheckoutImage}>
				<JoomlaArticleRegion title={"Purchase a gift certificate to Community Boating!"}>
					Give your family member or friend the gift of sailing at Community Boating so they can enjoy the great outdoors by sailing,
					kayaking, paddleboarding, or windsurfing on the Charles River. Gift Certificates can be sold for a given dollar value,
					which can be used towards Adult Program memberships, merchandise, or additional add-ons. Memberships include classes,
					boat usage, and boathouse privileges. We also sell retail items at the Front Office, including t-shirts, hats, gloves,
					water bottles, instruction books, and more.
					<br />
					<br />
					<br />
					<table><tbody><tr>
						<td style={{verticalAlign: "top"}}>
							<JoomlaReport
								headers={["Recommended values*:"]}
								rows={memRows}
							/>
						</td>
						<td style={{verticalAlign: "top", paddingLeft:"20px"}}>
							<JoomlaReport
								headers={["Add Ons*:"]}
								rows={[
									[this.renderRow("Damage Waiver", Currency.dollars(this.props.prices.damageWaiverPrice).format())],
									[this.renderRow("Guest Privileges", Currency.dollars(this.props.prices.guestPrivsPrice).format())],
								]}
							/>
						</td>
					</tr></tbody></table>
					<br />
					<br />
					Gift certificates can be redeemed at any time, and memberships will begin at that time.
					Gift certificates are based on a monetary value. The recommended values are based off of this season's membership pricing.
					These values are subject to change on a seasonal basis and the difference will be due at the time of redemption.
					Gift Certificates are available in any amount you specify towards the purchase of Adult Program memberships, merchandise,
					or additional add-ons. Gift certificates cannot be redeemed for cash and are non-refundable.
					Gift certificates may be transferred upon contacting our Front Office.
					If a gift certificate is lost or stolen, contact our Front Office immediately to deactivate the old gift certificate
					and reissue a new gift certificate by e-mail. All gift certificates are valid for up to seven years from the date of purchase.
					<br />
					<br />
					*The recommended values are based off of this season's membership pricing.
					These values are subject to change on a seasonal basis and the difference will be due at the time of redemption.
				</JoomlaArticleRegion>
				<JoomlaArticleRegion title="Certificate Amount">
					<table><tbody>
						<FormInput
							id="certAmount"
							label="Amount   $"
							value={self.state.formData.certAmount}
							updateAction={updateState}
						/>
					</tbody></table>
				</JoomlaArticleRegion>
				<table><tbody><tr>
					<td style={{verticalAlign: "top"}}>
						<JoomlaArticleRegion title="Purchaser Information">
							<table><tbody>
								<FormInput
									id="purchaserFirstName"
									label="Your First Name"
									value={this.state.formData.purchaserFirstName}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
								<FormInput
									id="purchaserLastName"
									label="Your Last Name"
									value={this.state.formData.purchaserLastName}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
								<FormInput
									id="purchaserEmail"
									label="Your Email"
									value={this.state.formData.purchaserEmail}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
							</tbody></table>
						</JoomlaArticleRegion>
					</td>
					<td style={{paddingLeft: "30px", verticalAlign: "top"}}>
						<JoomlaArticleRegion title="Recipient Information">
							<table><tbody>
								<FormInput
									id="recipientFirstName"
									label="Recipient First Name"
									value={this.state.formData.recipientFirstName}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
								<FormInput
									id="recipientLastName"
									label="Recipient Last Name"
									value={this.state.formData.recipientLastName}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
							</tbody></table>
						</JoomlaArticleRegion>
					</td>
				</tr></tbody></table>
				<JoomlaArticleRegion title="Delivery Information">
					<table><tbody><tr>
						<td style={{verticalAlign: "top"}}>
							How would you like your gift certificate to be delivered?
							<br />
							<br />
							<FormRadio
								id="deliveryMethod"
								justElement={true}
								columns={1}
								values={[{
									key: DeliveryMethod.Email,
									display: "Email only (option to print certificate)"
								}, {
									key: DeliveryMethod.Mail,
									display: "Mail a physical certificate"
								}, {
									key: DeliveryMethod.Pickup,
									display: "I'll pick up a certificate in person"
								}]}
								updateAction={updateState}
								value={this.state.formData.deliveryMethod}
							/>
						</td>
						<td width="50%" style={{verticalAlign: "top"}}>
							{this.state.formData.deliveryMethod.getOrElse(null) == DeliveryMethod.Pickup ? inPersonText : null}
						</td>
					</tr></tbody></table>
				</JoomlaArticleRegion>
			</JoomlaMainPage>
		)
	}
}