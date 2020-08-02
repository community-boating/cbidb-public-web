import { none, Option, some } from 'fp-ts/lib/Option';
import { History } from 'history';
import * as t from 'io-ts';
import * as React from "react";

import { validator, postWrapper } from "../../../async/member/required";
import Button from "../../../components/Button";
import DateTriPicker, {  dateStringToComponents, DateTriPickerProps, componentsToDate } from "../../../components/DateTriPicker";
import PhoneTriBox, { PhoneTriBoxProps, splitPhone, combinePhone } from "../../../components/PhoneTriBox";
import { Select } from "../../../components/Select";
import TextArea from "../../../components/TextArea";
import TextInput from "../../../components/TextInput";
import countries from "../../../lov/countries";
import states from "../../../lov/states";
import JoomlaArticleRegion from "../../../theme/joomla/JoomlaArticleRegion";
import JoomlaNotitleRegion from "../../../theme/joomla/JoomlaNotitleRegion";
import formUpdateState from '../../../util/form-update-state';
import range from "../../../util/range";
import moment = require('moment');
import ErrorDiv from '../../../theme/joomla/ErrorDiv';
import asc from '../../../app/AppStateContainer';
import NavBarLogoutOnly from '../../../components/NavBarLogoutOnly';
import { setAPImage } from '../../../util/set-bg-image';
import { makePostJSON } from '../../../core/APIWrapperUtil';
import FactaMainPage from '../../../theme/facta/FactaMainPage';

type ApiType = t.TypeOf<typeof validator>

export type Form = ApiType & {
	dobMonth: Option<string>,
	dobDate: Option<string>,
	dobYear: Option<string>,
	primaryPhoneFirst: Option<string>,
	primaryPhoneSecond: Option<string>,
	primaryPhoneThird: Option<string>,
	primaryPhoneExt: Option<string>
	alternatePhoneFirst: Option<string>,
	alternatePhoneSecond: Option<string>,
	alternatePhoneThird: Option<string>,
	alternatePhoneExt: Option<string>
}

const apiToForm: (api: ApiType) => Form = api => {
	const {first: primaryPhoneFirst, second: primaryPhoneSecond, third: primaryPhoneThird, ext: primaryPhoneExt} = splitPhone(api.primaryPhone)
	const {first: alternatePhoneFirst, second: alternatePhoneSecond, third: alternatePhoneThird, ext: alternatePhoneExt} = splitPhone(api.alternatePhone)
	const [dobMonth, dobDate, dobYear] = dateStringToComponents(api.dob).fold(
		[none, none, none],
		a => [some(a.month), some(a.date), some(a.year)]
	)
	return {
		...api,
		dobDate,
		dobMonth,
		dobYear,
		primaryPhoneFirst,
		primaryPhoneSecond,
		primaryPhoneThird,
		primaryPhoneExt,
		alternatePhoneFirst,
		alternatePhoneSecond,
		alternatePhoneThird,
		alternatePhoneExt
	}
}

const formToAPI: (form: Form) => ApiType = form => {
	return {
		...form,
		dob: componentsToDate(form.dobMonth, form.dobDate, form.dobYear),
		primaryPhone: combinePhone(form.primaryPhoneFirst, form.primaryPhoneSecond, form.primaryPhoneThird, form.primaryPhoneExt),
		alternatePhone: combinePhone(form.alternatePhoneFirst, form.alternatePhoneSecond, form.alternatePhoneThird, form.alternatePhoneExt)
	}
}

class FormInput extends TextInput<Form> {}
class FormSelect extends Select<Form> {}
class FormTextArea extends TextArea<Form> {}

interface Props {
	initialFormData: ApiType,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element,
	history: History<any>
}

interface State {
	formData: Form,
	validationErrors: string[]
}

export default class ApRequiredInfo extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			formData: apiToForm(this.props.initialFormData),
			validationErrors: []
		};
	}
	render() {
		const formData = this.state.formData;
		const self = this;
		const updateState = formUpdateState(this.state, this.setState.bind(this), "formData");

		const thisYear = Number(moment().format("YYYY"))
		const years = range(thisYear-120, thisYear-15)

		// TODO: DOB constituent dropdowns could react to each others changes
		// e.g. pick day=31, then month=feb, day should blank out
		// TODO: Move the whole DOB thing into its own component
		const reqFields = (
			<table><tbody>
				<FormInput
					id="namePrefix"
					label="Name Prefix"
					value={formData.namePrefix}
					updateAction={updateState}
					maxLength={5}
				/>
				<FormInput
					id="firstName"
					label="First Name"
					isRequired={true}
					value={formData.firstName}
					updateAction={updateState}
				/>
				<FormInput
					id="middleInitial"
					label="Middle Initial"
					value={formData.middleInitial}
					updateAction={updateState}
					maxLength={5}
				/>
				<FormInput
					id="lastName"
					label="Last Name"
					isRequired={true}
					value={formData.lastName}
					updateAction={updateState}
				/>
				<FormInput
					id="nameSuffix"
					label="Name Suffix"
					value={formData.nameSuffix}
					updateAction={updateState}
					maxLength={5}
				/>
				<DateTriPicker<Form, DateTriPickerProps<Form>>
					years={years}
					monthID="dobMonth"
					dayID="dobDate"
					yearID="dobYear"
					isRequired={true}
					monthValue={formData.dobMonth}
					dayValue={formData.dobDate}
					yearValue={formData.dobYear}
					updateAction={updateState}
				/>
				<tr>
					<td style={{ textAlign: "right" }}>
						<label>
							<span className="optional">Email</span>
						</label>
					</td>
					<td style={{ textAlign: "left" }}>
						{asc.state.login.authenticatedUserName.getOrElse("")}
					</td>
				</tr>
				
				<FormInput
					id="addr1"
					label="Address 1"
					isRequired={true}
					value={formData.addr1}
					updateAction={updateState}
				/>
				<FormInput
					id="addr2"
					label="Address 2"
					value={formData.addr2}
					updateAction={updateState}
				/>
				<FormInput
					id="addr3"
					label="Address 3"
					value={formData.addr3}
					updateAction={updateState}
				/>
				<FormInput
					id="city"
					label="City"
					isRequired={true}
					value={formData.city}
					updateAction={updateState}
				/>
				<FormSelect
					id="state"
					label="State"
					isRequired={true}
					value={formData.state}
					updateAction={updateState}
					options={states}
					nullDisplay="- Select -"
				/>
				<FormInput
					id="zip"
					label="Zip"
					isRequired={true}
					value={formData.zip}
					updateAction={updateState}
				/>
				<FormSelect		// TODO: default to US
					id="country"
					label="Country"
					value={formData.country}
					updateAction={updateState}
					options={countries}
					nullDisplay="- Select -"
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Primary Phone"
					firstID="primaryPhoneFirst"
					secondID="primaryPhoneSecond"
					thirdID="primaryPhoneThird"
					extID="primaryPhoneExt"
					typeID="primaryPhoneType"
					firstValue={formData.primaryPhoneFirst}
					secondValue={formData.primaryPhoneSecond}
					thirdValue={formData.primaryPhoneThird}
					extValue={formData.primaryPhoneExt}
					typeValue={formData.primaryPhoneType}
					updateAction={updateState}
					isRequired={true}
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Alternate Phone"
					firstID="alternatePhoneFirst"
					secondID="alternatePhoneSecond"
					thirdID="alternatePhoneThird"
					extID="alternatePhoneExt"
					typeID="alternatePhoneType"
					firstValue={formData.alternatePhoneFirst}
					secondValue={formData.alternatePhoneSecond}
					thirdValue={formData.alternatePhoneThird}
					extValue={formData.alternatePhoneExt}
					typeValue={formData.alternatePhoneType}
					updateAction={updateState}
				/>
				<FormTextArea
					id="allergies"
					label="Allergies"
					rows={4}
					cols={60}
					value={formData.allergies}
					updateAction={updateState}
					placeholder="Please leave blank if none"
					maxLength={3999}
				/>
				<FormTextArea
					id="medications"
					label="Medications"
					rows={4}
					cols={60}
					value={formData.medications}
					updateAction={updateState}
					placeholder="Please leave blank if none"
					maxLength={3999}
				/>
				<FormTextArea
					id="specialNeeds"
					label="Special Needs"
					rows={4}
					cols={60}
					value={formData.specialNeeds}
					updateAction={updateState}
					placeholder="Please leave blank if none"
					maxLength={3999}
				/>
			</tbody></table>
		);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <ErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		// const headerRegion = <JoomlaArticleRegion title="Please take a moment to confirm your personal information.">
		// 	New address or phone number? Need to change your emergency contact? Help us keep our records up-to-date.
		// </JoomlaArticleRegion>;

		return <FactaMainPage setBGImage={setAPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			{errorPopup}
			<JoomlaNotitleRegion>
				{this.props.breadcrumb}
			</JoomlaNotitleRegion>
			{/* {headerRegion} */}
			<JoomlaArticleRegion title="All information on this page is required (if applicable).">
				{reqFields}
			</JoomlaArticleRegion>
			{(
				asc.state.justLoggedIn
				? null
				:<Button text="< Back" onClick={self.props.goPrev}/>
			)}
			
			<Button text="Next >" spinnerOnClick onClick={() => {
				return postWrapper.send(makePostJSON(formToAPI(this.state.formData))).then(
					// api success
					ret => {
						if (ret.type == "Success") {
							asc.updateState.setJustLoggedIn(false);
							self.props.goNext()
						} else {
							window.scrollTo(0, 0);
							self.setState({
								...self.state,
								validationErrors: ret.message.split("\\n") // TODO
							});
						}
					}
				)
				
			}}/>
		</FactaMainPage>
	}
}