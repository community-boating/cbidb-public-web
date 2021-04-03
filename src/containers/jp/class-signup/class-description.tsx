import * as React from "react";
import {History} from 'history';

import {classTimePageRoute} from "@routes/jp/classTime"
import FactaButton from "@facta/FactaButton";

export interface ClassType {
	typeId: number,
	typeName: string,
	prereq: string,
	sessionCt: number,
	sessionLength?: number,
	sessionLengthMinutes?: number,
	classSize: string | number,
	description: JSX.Element,
	durationOverride?: string,
}

export const asFragmentOptionalSignupLink = (includeLink: boolean) => (history: History<any>, juniorId: number) => (ct: ClassType) => {
	const lengthString = (
		ct.sessionLengthMinutes
		? `${ct.sessionLengthMinutes} minutes/day`
		: `${ct.sessionLength} hours/day`
	);
	const durationString = (
		ct.durationOverride
		? ct.durationOverride
		: `${ct.sessionCt} days; ${lengthString}`
	);
	return (
		<React.Fragment key={ct.typeId}>
			<i>Prerequisite: {ct.prereq}.  Duration: {durationString}.  Class Size: {ct.classSize == 0 ? "No Limit" : String(ct.classSize)}.</i>
			<br />
			{ct.description}
			<br /><br />
			{includeLink ? (
				<React.Fragment>
					<FactaButton text="Click here to sign up!" onClick={() => Promise.resolve(history.push(classTimePageRoute.pathWrapper.getPathFromArgs({ personId: String(juniorId), typeId: String(ct.typeId) })))}/>
					<br /><br />
				</React.Fragment>
			) : null}

		</React.Fragment>
	);
}

export const asFragment = asFragmentOptionalSignupLink(true)


export const asDivOptionalSignupLink = (includeLink: boolean) => (history: History<any>, juniorId: number) => (ct: ClassType) => (
	<div style={{ paddingLeft: "40px"}} key={ct.typeId}>
		<h3 style={{ textTransform: "none", fontSize: "1.4em" }}><span style={{ fontStyle: "italic" }}>{ct.typeName}</span></h3>
		{asFragmentOptionalSignupLink(includeLink)(history, juniorId)(ct)}
	</div>
)

export const asDiv = asDivOptionalSignupLink(true);
