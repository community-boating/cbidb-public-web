import * as React from 'react';
import * as t from 'io-ts';
import {History} from 'history';
import { setCheckoutImage } from 'util/set-bg-image';
import {validator as pricesValidator} from "async/prices"
import StandardReport from 'theme/facta/StandardReport';
import { MAGIC_NUMBERS } from 'app/magicNumbers';
import Currency from 'util/Currency';
import { none, Option, some } from 'fp-ts/lib/Option';
import TextInput from 'components/TextInput';
import formUpdateState from 'util/form-update-state';
import { RadioGroup } from 'components/InputGroup';
import { Select } from 'components/Select';
import states from 'lov/states';
import {postWrapper as setGC} from "async/member/gc-purchase"
import { makePostJSON, PostURLEncoded } from 'core/APIWrapperUtil';
import {postWrapper as getProtoPersonCookie} from "async/check-proto-person-cookie"
import {validator as gcValidator} from "async/member/gc-purchase"
import { orderStatusValidator } from "async/order-status"
import FactaMainPage from 'theme/facta/FactaMainPage';
import FactaArticleRegion from 'theme/facta/FactaArticleRegion';
import FactaButton from 'theme/facta/FactaButton';
import StandalonePurchaserInfo from 'components/StandalonePurchaserInfo';

type Prices = t.TypeOf<typeof pricesValidator>;
type GC = t.TypeOf<typeof gcValidator>;

type Props = {
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	prices: Prices,
	history: History<any>,
	gc: GC,
	orderStatus: t.TypeOf<typeof orderStatusValidator>,
}

export enum GiftCertDeliveryMethod {
	Email="E",
	Mail="M",
	Pickup="P"
}

export type Form = {
	certAmount: Option<string>,
	purchaserNameFirst: Option<string>,
	purchaserNameLast: Option<string>,
	purchaserEmail: Option<string>,
	recipientNameFirst: Option<string>,
	recipientNameLast: Option<string>,
	deliveryMethod: Option<string>,
	whoseEmail: Option<string>,
	recipientEmail: Option<string>,
	whoseAddress: Option<string>,
	addr1: Option<string>,
	addr2: Option<string>,
	city: Option<string>,
	state: Option<string>,
	zip: Option<string>,
}

type State = {
	formData: Form,
	validationErrors: string[],
	hasPersonWarning: boolean
}

class FormInput extends TextInput<Form> {}
class FormRadio extends RadioGroup<Form> {}
class FormSelect extends Select<Form> {}

export default class GiftCertificatesDetailsPage extends React.PureComponent<Props, State> {
	constructor(props: Props){
		super(props);
		this.state = {
			validationErrors: [],
			formData: {
				certAmount: props.gc.deliveryMethod == "X" ? none : some(String(props.gc.valueInCents / 100)),
				purchaserNameFirst: props.orderStatus.nameFirst,
				purchaserNameLast: props.orderStatus.nameLast,
				purchaserEmail: props.orderStatus.email,
				recipientNameFirst: props.gc.recipientNameFirst,
				recipientNameLast: props.gc.recipientNameLast,
				deliveryMethod: props.gc.deliveryMethod == "X" ? none : some(props.gc.deliveryMethod),
				whoseEmail: props.gc.whoseEmail,
				recipientEmail: props.gc.recipientEmail,
				whoseAddress: props.gc.whoseAddress,
				addr1: props.gc.addr1,
				addr2: props.gc.addr2,
				city: props.gc.city,
				state: props.gc.state,
				zip: props.gc.zip,
			},
			hasPersonWarning: false
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
	clearErrors() {
		this.setState({
			...this.state,
			validationErrors: []
		})
	}
	doValidations() {
		const validations: [() => boolean, string][] = [
			[() => this.state.formData.certAmount.isSome(), "Certificate amount must be specified."],
			[() => {
				const candidate = Number(this.state.formData.certAmount.getOrElse(null));
				return !isNaN(candidate) && candidate > 0;
			}, "Certificate amount must be a valid dollar amount."],
			[() => this.state.formData.deliveryMethod.isSome(), "Delivery method must be specified."]
		];
		return validations
			.filter(([fn, msg]) => !fn())
			.map(([fn, msg]) => msg);
	}
	doSubmit(): Promise<any> {
		const self = this;
		this.clearErrors();
		const errors = this.doValidations();
		if (errors.length > 0) {
			this.setState({
				...this.state,
				validationErrors: errors
			});
			return Promise.resolve()
		} else {
			return getProtoPersonCookie.send(PostURLEncoded({})).then(() => setGC.send(makePostJSON({
				...this.state.formData,
				deliveryMethod: this.state.formData.deliveryMethod.getOrElse(null),
				valueInCents: Currency.dollars(Number(this.state.formData.certAmount.getOrElse("0"))).cents,
				purchasePriceCents: Currency.dollars(Number(this.state.formData.certAmount.getOrElse("0"))).cents,
			}))).then(ret => {
				if (ret.type == "Success") {
					self.props.goNext();
				} else {
					if(ret.message == "ACCOUNT_EXISTS"){
						self.setState((s) => ({...s,
							hasPersonWarning: true
						}))
					}else{
						self.setState({
							...self.state,
							validationErrors: ret.message.split("\\n") // TODO
						})
					}
				}
			});
		}
	}
	render() {
		const self = this
		const updateState = (id: string, value: string) => {formUpdateState(this.state, this.setState.bind(this), "formData")(id.replace("email", "purchaserEmail"), value)};
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
		</span>;

		const recipientEmail = <React.Fragment>
			<tr><td>&nbsp;</td></tr>
			<FormInput
				id="recipientEmail"
				label="Recipient Email"
				isRequired
				value={self.state.formData.recipientEmail}
				updateAction={updateState}
			/>
		</React.Fragment>

		const emailFrament = <React.Fragment>
			<table width="100%"><tbody>
			<tr><td width="30%"></td><td></td></tr>
			<FormRadio
				id="whoseEmail"
				label="Email to... "
				columns={1}
				values={[{
					key: "M",
					display: <React.Fragment>My Email. I choose to send<br />the gift certificate to the recipient myself.</React.Fragment>
				}, {
					key: "R",
					display: <React.Fragment>Recipient's Email. I choose to send<br />the gift certificate to the recipient directly.</React.Fragment>
				}]}
				isRequired
				updateAction={updateState}
				value={this.state.formData.whoseEmail}
			/>
			{this.state.formData.whoseEmail.getOrElse(null) == "R" ? recipientEmail : null}
			</tbody></table>
		</React.Fragment>;

		const mailFragment = <React.Fragment>
			<table><tbody>
				<FormRadio
					id="whoseAddress"
					label="This is..."
					columns={1}
					values={[{
						key: "M",
						display: "My Address"
					}, {
						key: "R",
						display: "Recipient's Address"
					}]}
					isRequired
					updateAction={updateState}
					value={this.state.formData.whoseAddress}
				/>
				<FormInput
					id="addr1"
					label="Delivery Address"
					isRequired
					value={self.state.formData.addr1}
					updateAction={updateState}
				/>
				<FormInput
					id="addr2"
					label="Address Line 2"
					value={self.state.formData.addr2}
					updateAction={updateState}
				/>
				<FormInput
					id="city"
					label="City"
					isRequired
					value={self.state.formData.city}
					updateAction={updateState}
				/>
				<FormSelect
					id="state"
					label="State"
					options={states}
					nullDisplay="- Select -"
					isRequired
					updateAction={updateState}
					value={this.state.formData.state}
				/>
				<FormInput
					id="zip"
					label="Zip"
					isRequired
					size={10}
					value={self.state.formData.zip}
					updateAction={updateState}
				/>
			</tbody></table>
			<br />
			If you are giving this as a present for the holiday season, please be aware that USPS may take up to 10 days for delivery.
			If you require immediate mailing, purchasing a gift certificate to be e-mailed is highly recommended.
		</React.Fragment>;

		return (
			<FactaMainPage setBGImage={setCheckoutImage} errors={this.state.validationErrors}>
				<FactaArticleRegion title={"Purchase a gift certificate to Community Boating!"}>
					Give your family member or friend the gift of sailing at Community Boating so they can enjoy the great outdoors by sailing,
					kayaking, paddleboarding, or windsurfing on the Charles River. Gift Certificates can be sold for a given dollar value,
					which can be used towards Adult Program memberships, non-member rentals, merchandise, or additional add-ons. Memberships include classes,
					boat usage, and boathouse privileges. We also sell retail items at the Front Office, including t-shirts, hats, gloves,
					water bottles, instruction books, and more.
					<br />
					<br />
					<br />
					<table><tbody><tr>
						<td style={{verticalAlign: "top"}}>
							<StandardReport
								headers={["Recommended values*:"]}
								rows={memRows}
							/>
						</td>
						<td style={{verticalAlign: "top", paddingLeft:"20px"}}>
							<StandardReport
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
				</FactaArticleRegion>
				<FactaArticleRegion title="Certificate Amount">
					<table><tbody>
						<FormInput
							id="certAmount"
							label="Amount   $"
							value={self.state.formData.certAmount}
							updateAction={updateState}
						/>
					</tbody></table>
				</FactaArticleRegion>
				<table><tbody><tr>
					<td style={{verticalAlign: "top"}}>
						<StandalonePurchaserInfo authedAsRealPerson={this.props.orderStatus.authedAsRealPerson} state={{...this.state, formData: {...this.state.formData, email: this.state.formData.purchaserEmail}}} updateState={updateState} history={this.props.history} hasPersonWarning={this.state.hasPersonWarning}/>
					</td>
					<td style={{paddingLeft: "30px", verticalAlign: "top"}}>
						<FactaArticleRegion title="Recipient Information">
							<table><tbody>
								<FormInput
									id="recipientNameFirst"
									label="Recipient First Name"
									value={this.state.formData.recipientNameFirst}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
								<FormInput
									id="recipientNameLast"
									label="Recipient Last Name"
									value={this.state.formData.recipientNameLast}
									updateAction={updateState}
									size={30}
									maxLength={255}
									isRequired
								/>
							</tbody></table>
						</FactaArticleRegion>
					</td>
				</tr></tbody></table>
				<FactaArticleRegion title="Delivery Information">
					<table width="100%"><tbody><tr>
						<td style={{verticalAlign: "top"}}>
							How would you like your gift certificate to be delivered?
							<br />
							<br />
							<FormRadio
								id="deliveryMethod"
								justElement={true}
								columns={1}
								values={[{
									key: GiftCertDeliveryMethod.Email,
									display: "Email only (option to print certificate)"
								}, {
									key: GiftCertDeliveryMethod.Mail,
									display: "Mail a physical certificate"
								}, {
									key: GiftCertDeliveryMethod.Pickup,
									display: "I'll pick up a certificate in person"
								}]}
								updateAction={updateState}
								value={this.state.formData.deliveryMethod}
							/>
						</td>
						<td width="55%" style={{verticalAlign: "top"}}>
							{this.state.formData.deliveryMethod.getOrElse(null) == GiftCertDeliveryMethod.Pickup ? inPersonText : null}
							{this.state.formData.deliveryMethod.getOrElse(null) == GiftCertDeliveryMethod.Email ? emailFrament : null}
							{this.state.formData.deliveryMethod.getOrElse(null) == GiftCertDeliveryMethod.Mail ? mailFragment : null}
						</td>
					</tr></tbody></table>
				</FactaArticleRegion>
				<FactaButton text="Next >" spinnerOnClick onClick={this.doSubmit.bind(this)} />
			</FactaMainPage>
		)
	}
}