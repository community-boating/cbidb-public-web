import * as t from 'io-ts';
import * as React from "react";

import { validator } from "async/junior/see-types";
import FactaArticleRegion from "theme/facta/FactaArticleRegion";
import { asDiv, asFragment, ClassType } from "./class-description";
import advanced from "./types/advanced";
import beginner from "./types/beginner";
import int1 from "./types/intermediate-1";
import int2 from "./types/intermediate-2";
import other from './types/other';
import JpClassSignupSidebar from 'components/JpClassSignupSidebar';
import { GetSignupsAPIResult } from 'async/junior/get-signups';
import { History } from 'history'
import FactaButton from 'theme/facta/FactaButton';
import {FactaErrorDiv} from 'theme/facta/FactaErrorDiv';
import NavBarLogoutOnly from 'components/NavBarLogoutOnly';
import { none, Option } from 'fp-ts/lib/Option';
import { setJPImage } from 'util/set-bg-image';
import { jpBasePath } from 'app/paths/jp/_base';
import FactaSidebarPage from 'theme/facta/FactaSidebarPage';
import { FactaSuccessDiv } from 'theme/facta/FactaSuccessDiv';

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

		const int1Region = (canSeeClass(int1)
			? (
				<FactaArticleRegion title={<React.Fragment>Intermediate I</React.Fragment>}>
					{asFragmentCurried(int1)}
				</FactaArticleRegion>
			)
			: ""
		);

		const int2Region = (canSeeClass(int2)
			? (
				<FactaArticleRegion title={<React.Fragment>Intermediate II</React.Fragment>}>
					{asFragmentCurried(int2)}
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
				{int1Region}
				{int2Region}
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
