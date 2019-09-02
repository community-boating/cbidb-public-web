import * as React from "react";
import { Link } from "react-router-dom";

import { paths } from "../../app/routing";

export interface ClassType {
	typeId: number,
	typeName: string,
	prereq: string,
	sessionCt: number,
	sessionLength: number,
	classSize: number,
	description: JSX.Element
}

export const asFragment = (juniorId: number) => (ct: ClassType) => (
	<React.Fragment key={ct.typeId}>
		<i>Prerequisite: {ct.prereq}.  Duration: {ct.sessionCt} days; {ct.sessionLength} hours/day.  Class Size: {ct.classSize == 0 ? "No Limit" : String(ct.classSize)}.</i>
		<br />
		{ct.description}
		<br /><br />
		<Link to={paths.classTime.path.replace(":personId", String(juniorId)).replace(":typeId", String(ct.typeId))}>Click here to sign up!</Link>
		<br /><br />
	</React.Fragment>
)


export const asDiv = (juniorId: number) => (ct: ClassType) => (
	<div style={{ paddingLeft: "40px"}} key={ct.typeId}>
		<h3 style={{ textTransform: "none", fontSize: "1.4em" }}><span style={{ fontStyle: "italic" }}>{ct.typeName}</span></h3>
		{asFragment(juniorId)(ct)}
	</div>
)