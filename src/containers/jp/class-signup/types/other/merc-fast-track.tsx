import * as React from "react";
import { ClassType } from "../../class-description";

const data: ClassType = {
	typeId: 1281,
	typeName: "Mercury Fast Track",
	prereq: "Mercury Green Rating or previous experience",
	sessionCt: 1,
	sessionLength: 2.5,
	durationOverride: '1 half-day',
	classSize: 'self-directed',
	description: (<React.Fragment>
		Intended for sailors with prior experience elsewhere to become familiar with our boats and facility so they can jump into Intermediate "running".<br />
		<br />
		For 2021, our half-day Mercury Fast-track class is moving online! Students can review the seven slideshows
		on our <a target="_blank" href="https://www.community-boating.org/member-resources/e-learning/">e-learning page</a> and then book a time to do our
		verbal and rigging checks at the boathouse.
	</React.Fragment>)
}

export default data; 
