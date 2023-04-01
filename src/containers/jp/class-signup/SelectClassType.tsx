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
import { JpSignupError } from './JpSignupError';

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
	validationErrors: string[],
	clickedInstance: number
}

export default class SelectClassType extends React.Component<Props, State> {
	formData: Form
	constructor(props: Props) {
		super(props);
		this.formData = apiToForm(this.props.apiResultArray);
		this.state = {
			validationErrors: [],
			clickedInstance: null
		}
	}
	private findTypeId(instanceId: number) {
		return this.props.signups.waitLists.filter(wl => wl.instanceId == instanceId).map(wl => wl.typeId)
			.concat(this.props.signups.waitListTops.filter(wl => wl.instanceId == instanceId).map(wl => wl.typeId))[0]
	}
	private findConflictingSignups(instanceId: number) {
		const typeId = this.findTypeId(instanceId);
			

		return this.props.signups.waitLists.filter(wl => wl.typeId == typeId && wl.instanceId != instanceId ).map(wl => ({
			instanceId: wl.instanceId,
			dateString: wl.dateString,
			timeString: wl.timeString
		})).concat(this.props.signups.waitListTops.filter(wl => wl.typeId == typeId && wl.instanceId != instanceId ).map(wl => ({
			instanceId: wl.instanceId,
			dateString: wl.dateString,
			timeString: wl.timeString
		})))
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

		const errorStrings = this.state.validationErrors.flatMap(ve => ve.split("<br><br>"))

		const errorPopup = (
			(this.state.validationErrors.length > 0)
			? <FactaErrorDiv errors={errorStrings} dontEscapeHTML={false} suffixes={JpSignupError({
				personId: this.props.personId,
				typeId: this.findTypeId(this.state.clickedInstance),
				instanceId: this.state.clickedInstance,
				path: this.props.history.location.pathname,
				history: this.props.history,
				errs: errorStrings,
				conflictingSignups: this.findConflictingSignups(this.state.clickedInstance),
				setValidationErrors: errors => {
					window.scrollTo(0, 0);
					this.setState({
						...this.state,
						validationErrors: errors
					})
				}
			})}/>
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
				setClickedInstance={function(clickedInstance: number) { return self.setState({ ...self.state, clickedInstance }); }.bind(self)}
			/>}>
				{success}
			</FactaSidebarPage>
		)
	}
}
