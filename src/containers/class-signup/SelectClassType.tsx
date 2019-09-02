import * as t from 'io-ts';
import * as React from "react";

import { validator } from "../../async/junior/see-types";
import Joomla8_4 from "../../theme/joomla/Joomla8_4";
import JoomlaArticleRegion from "../../theme/joomla/JoomlaArticleRegion";
import JoomlaSidebarRegion from "../../theme/joomla/JoomlaSidebarRegion";
import { asDiv, asFragment, ClassType } from "./class-description";
import advanced from "./types/advanced";
import beginner from "./types/beginner";
import intermediate from "./types/intermediate";
import other from './types/other';

export const formName = "selectClassType"

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
	apiResultArray: APIResult
}

export default class SelectClassType extends React.Component<Props> {
	formData: Form
	constructor(props: Props) {
		super(props);
		this.formData = apiToForm(this.props.apiResultArray);
	}
	render() {
		const self = this;
		const asFragmentCurried = asFragment(self.props.personId)
		const asDivCurried = asDiv(self.props.personId)
		const canSeeClass = (c: ClassType) => !!this.formData.classTypesHash[String(c.typeId)];

		const beginnerRegion = (canSeeClass(beginner)
			? (
				<JoomlaArticleRegion title={<React.Fragment>First Step: <i>Beginner Sailing</i></React.Fragment>}>
					{asFragmentCurried(beginner)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const intermediateRegion = (canSeeClass(intermediate)
			? (
				<JoomlaArticleRegion title={<React.Fragment>Next Step: <i>Intermediate Sailing</i></React.Fragment>}>
					{asFragmentCurried(intermediate)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const advancedCanSee = advanced.filter(canSeeClass)
		const advancedRegion = (advancedCanSee.length > 0
			? (
				<JoomlaArticleRegion title={<React.Fragment>Next Step: Advanced Classes</React.Fragment>}>
					{advancedCanSee.map(asDivCurried)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const otherCanSee = other.filter(canSeeClass);
		const otherRegion = (otherCanSee.length > 0
			? (
				<JoomlaArticleRegion title="Other Available Classes">
					{otherCanSee.map(asDivCurried)}
				</JoomlaArticleRegion>
			)
			: ""
		);

		const allRegions = (
			<React.Fragment>
				{beginnerRegion}
				{intermediateRegion}
				{advancedRegion}
				{otherRegion}
			</React.Fragment>
		);

		return (
			<Joomla8_4 main={allRegions} right={<JoomlaSidebarRegion title="sidebar"></JoomlaSidebarRegion>} />
		)
	}
}