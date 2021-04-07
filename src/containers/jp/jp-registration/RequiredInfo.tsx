import { none, Option, some } from 'fp-ts/lib/Option';
import { History } from 'history';
import * as t from 'io-ts';
import * as React from "react";

import { postWrapper, validator } from "@async/junior/required";
import FactaButton from "@facta/FactaButton";
import DateTriPicker, { componentsToDate, dateStringToComponents, DateTriPickerProps } from "@components/DateTriPicker";
import PhoneTriBox, { combinePhone, PhoneTriBoxProps, splitPhone } from "@components/PhoneTriBox";
import { Select } from "@components/Select";
import TextArea from "@components/TextArea";
import TextInput from "@components/TextInput";
import { makePostJSON } from '@core/APIWrapperUtil';
import countries from "@lov/countries";
import states from "@lov/states";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import FactaNotitleRegion from "@facta/FactaNotitleRegion";
import formUpdateState from '@util/form-update-state';
import range from "@util/range";
import * as moment from 'moment';
import {FactaErrorDiv} from '@facta/FactaErrorDiv';
import asc from '@app/AppStateContainer';
import NavBarLogoutOnly from '@components/NavBarLogoutOnly';
import { setJPImage } from '@util/set-bg-image';
import FactaMainPage from '@facta/FactaMainPage';

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
	personId: Option<number>,
	initialFormData: ApiType,
	goNext: () => Promise<void>,
	goPrev: () => Promise<void>,
	breadcrumb: JSX.Element,
	history: History<any>,
	bindPersonId: (personId: number) => void,
	editOnly: boolean
}

interface State {
	formData: Form,
	validationErrors: string[]
}

export default class RequiredInfo extends React.Component<Props, State> {
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
		const years = range(thisYear-20, thisYear)

		// TODO: DOB constituent dropdowns could react to each others changes
		// e.g. pick day=31, then month=feb, day should blank out
		// TODO: Move the whole DOB thing into its own component
		const reqFields = (
			<table><tbody>
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
				<FormInput
					id="childEmail"
					label="Child Email"
					value={formData.childEmail}
					updateAction={updateState}
				/>
				{// TODO: actual parent email
				}
				<tr>
					<td style={{ textAlign: "right" }}>
						<label>
							<span className="optional">Parent Email</span>
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
					isRequired={true}
					value={formData.country}
					updateAction={updateState}
					options={countries}
					nullDisplay="- Select -"
				/>
				<PhoneTriBox<Form,  PhoneTriBoxProps<Form>>
					label="Parent Primary Phone"
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
					label="Parent Alternate Phone"
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
			</tbody></table>
		);

		const specNeedsFields = (
			<table><tbody>
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
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		return <FactaMainPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})}>
			{errorPopup}
			<FactaNotitleRegion>
				{this.props.breadcrumb}
			</FactaNotitleRegion>
			<FactaArticleRegion title="All information on this page is required (if applicable).">
				{reqFields}
			</FactaArticleRegion>
			<FactaArticleRegion title="Does your child have any allergies, medications, or special needs we should be aware of?">
				If not, please leave the following fields blank.
				<br /><br />
				<span style={{color: "red"}}>If your child is high risk for Covid-19 complications as defined by the CDC, please state that here,
				and consult with a healthcare professional about his or her participation in this program.</span>
				<br />
				<br />
				{specNeedsFields}
			</FactaArticleRegion>
			<FactaButton text="< Back" onClick={self.props.goPrev}/>
			<FactaButton text="Next >" spinnerOnClick onClick={() => {
				return postWrapper(this.props.personId, this.props.editOnly).send(makePostJSON(formToAPI(this.state.formData))).then(
					// api success
					ret => {
						if (ret.type == "Success") {
							self.props.bindPersonId(ret.success.personId)
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
