import * as t from 'io-ts';
import * as React from "react";

import { validator } from "@async/junior/see-types";
import FactaArticleRegion from "@facta/FactaArticleRegion";
import { asDiv, asFragment, ClassType } from "./class-description";
import advanced from "./types/advanced";
import beginner from "./types/beginner";
import intermediate from "./types/intermediate";
import other from './types/other';
import JpClassSignupSidebar from '@components/JpClassSignupSidebar';
import { GetSignupsAPIResult } from '@async/junior/get-signups';
import { History } from 'history'
import FactaButton from '@facta/FactaButton';
import {FactaErrorDiv} from '@facta/FactaErrorDiv';
import NavBarLogoutOnly from '@components/NavBarLogoutOnly';
import { none, Option } from 'fp-ts/lib/Option';
import { setJPImage } from '@util/set-bg-image';
import { jpBasePath } from '@paths/jp/_base';
import FactaSidebarPage from '@facta/FactaSidebarPage';
import { FactaSuccessDiv } from '@facta/FactaSuccessDiv';

export const path = "/class/:personId"

type ClassIDHash = {[K: string]: boolean};

type APIResult = t.TypeOf<typeof validator>;

export type Form = {
	apiResultArray: APIResult,
	classTypesHash: ClassIDHash
}

const classTypesArrayToHash: (arr: APIResult) => ClassIDHash = arr => arr.filter(e => e.canSee).reduce((hash, e) => {
	hash[String(e.typeId)] = e.canSee;
	return hash;
}, {} as ClassIDHash);

const apiToForm = (apiResultArray: APIResult) => ({
	apiResultArray: apiResultArray,
	classTypesHash: classTypesArrayToHash(apiResultArray)
})

interface Props {
	personId: number,
	history: History<any>,
	apiResultArray: APIResult,
	signups: GetSignupsAPIResult,
	successMsg: Option<string>
}

type State = {
	validationErrors: string[]
}

export default class SelectClassType extends React.Component<Props, State> {
	formData: Form
	constructor(props: Props) {
		super(props);
		this.formData = apiToForm(this.props.apiResultArray);
		this.state = {
			validationErrors: []
		}
	}
	render() {
		const self = this;
		const asFragmentCurried = asFragment(self.props.history, self.props.personId)
		const asDivCurried = asDiv(self.props.history, self.props.personId)
		const canSeeClass = (c: ClassType) => !!this.formData.classTypesHash[String(c.typeId)];

		const beginnerRegion = (canSeeClass(beginner)
			? (
				<FactaArticleRegion title={<React.Fragment>First Step: <i>Beginner Sailing</i></React.Fragment>}>
					{asFragmentCurried(beginner)}
				</FactaArticleRegion>
			)
			: ""
		);

		const intermediateRegion = (canSeeClass(intermediate)
			? (
				<FactaArticleRegion title={<React.Fragment>Next Step: <i>One-Week Intermediate</i></React.Fragment>}>
					{asFragmentCurried(intermediate)}
				</FactaArticleRegion>
			)
			: ""
		);

		const advancedCanSee = advanced.filter(canSeeClass)
		const advancedRegion = (advancedCanSee.length > 0
			? (
				<FactaArticleRegion title={<React.Fragment>Advanced Classes</React.Fragment>}>
					{advancedCanSee.map(asDivCurried)}
				</FactaArticleRegion>
			)
			: ""
		);

		const otherCanSee = other.filter(canSeeClass);
		const otherRegion = (otherCanSee.length > 0
			? (
				<FactaArticleRegion title="Other Available Classes">
					{otherCanSee.map(asDivCurried)}
				</FactaArticleRegion>
			)
			: ""
		);

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={this.state.validationErrors}/>
			: ""
		);

		const success = this.props.successMsg.map(msg => <FactaSuccessDiv msg={msg} />).getOrElse(null);

		const allRegions = (
			<React.Fragment>
				{errorPopup}
				<br />
				<FactaButton text="< Back" onClick={() => Promise.resolve(self.props.history.push(jpBasePath.getPathFromArgs({})))}/>
				{beginnerRegion}
				{intermediateRegion}
				{advancedRegion}
				{otherRegion}
			</React.Fragment>
		);

		return (
			<FactaSidebarPage setBGImage={setJPImage} navBar={NavBarLogoutOnly({history: this.props.history, sysdate: none, showProgramLink: false})} main={allRegions} right={<JpClassSignupSidebar
				signups={self.props.signups}
				history={self.props.history}
				setValidationErrors={validationErrors => self.setState({ ...self.state, validationErrors })}
			/>}>
				{success}
			</FactaSidebarPage>
		)
	}
}
