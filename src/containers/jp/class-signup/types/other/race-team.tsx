import * as React from "react";
import { ClassType } from "../../class-description";

const data: ClassType = {
	typeId: 281,
	typeName: "Race Team",
	prereq: "Race Team Rating",
	sessionCt: 5,
	sessionLength: 3,
	classSize: 0,
	description: (<React.Fragment>
		Racing skills are honed through practices and CBI weekly racing series. The team competes in regattas at sailing centers throughout the area. In order to join the Race Team, Juniors must earn the racing rating from the Intro to Racing class.
		Please see the <a href="https://www.community-boating.org/programs/junior-program/race-team/" target ="_blank">Race Team page</a> for more information.
		If your junior sailor is new to CBI but has prior racing experience and would like to join the race team,
		please contact the Junior Program Director at <a href="mailto:juniorprogramdirector@community-boating.org">juniorprogramdirector@community-boating.org</a>.
	</React.Fragment>)
}

export default data; 
