import * as React from "react";
import { ClassType } from "../class-description";

const data: ClassType = {
	typeId: 1221,
	typeName: "Beginner Sailing",
	prereq: "no experience necessary",
	sessionCt: 10,
	sessionLength: 2.5,
	classSize: 12,
	description: (<React.Fragment>
		Beginner Sailing includes an orientation to CBI, kayak safety, shore school, and much more. The first week covers all the basics including rigging,
		safety rules, and sailing maneuvers; everyone will sail with a partner in our beginner boats, with an instructor accompanying the group in a powerboat.
		Students will also learn the basics of kayaking in the first couple days. The second week continues with more advanced lessons and games
		designed to challenge and encourage our students. They'll be on the water every day; we try very hard to keep them active, in the sun, and having fun.
		Upon completion of the class, sailors will earn a green rating which indicates their ability to sail in light wind
		and qualifies them to take the Intermediate Class next year.
		<br /><br />
		New juniors with prior sailing experience can begin with more advanced classes; please email the Junior Program Director,
		at <a href="mailto:juniorprogramdirector@community-boating.org">juniorprogramdirector@community-boating.org</a> if you would like to request advanced placement.
	</React.Fragment>)
}

export default data; 
