import * as React from "react";
import { Link } from "react-router-dom";

import {classTimePageRoute} from "../../../app/routes/jp/classTime"

export interface ClassType {
	typeId: number,
	typeName: string,
	prereq: string,
	sessionCt: number,
	sessionLength?: number,
	sessionLengthMinutes?: number,
	classSize: number,
	description: JSX.Element
}

export const asFragmentOptionalSignupLink = (includeLink: boolean) => (juniorId: number) => (ct: ClassType) => {
	const lengthString = (
		ct.sessionLengthMinutes
		? `${ct.sessionLengthMinutes} minutes/day`
		: `${ct.sessionLength} hours/day`
	);
	return (
		<React.Fragment key={ct.typeId}>
			<i>Prerequisite: {ct.prereq}.  Duration: {ct.sessionCt} days; {lengthString}.  Class Size: {ct.classSize == 0 ? "No Limit" : String(ct.classSize)}.</i>
			<br />
			{ct.description}
			<br /><br />
			{includeLink ? (
				<React.Fragment>
					<Link to={classTimePageRoute.pathWrapper.getPathFromArgs({ personId: String(juniorId), typeId: String(ct.typeId) })}>Click here to sign up!</Link>
					<br /><br />
				</React.Fragment>
			) : null}

		</React.Fragment>
	);
}

export const asFragment = asFragmentOptionalSignupLink(true)


export const asDivOptionalSignupLink = (includeLink: boolean) => (juniorId: number) => (ct: ClassType) => (
	<div style={{ paddingLeft: "40px"}} key={ct.typeId}>
		<h3 style={{ textTransform: "none", fontSize: "1.4em" }}><span style={{ fontStyle: "italic" }}>{ct.typeName}</span></h3>
		{asFragmentOptionalSignupLink(includeLink)(juniorId)(ct)}
	</div>
)

export const asDiv = asDivOptionalSignupLink(true);
