import * as React from "react";
import { ClassType } from "../class-description";


const data: ClassType = {
	typeId: 1221,
	typeName: "Beginner Sailing",
	prereq: "no experience necessary",
	sessionCt: 10,
	sessionLength: 3,
	classSize: 16,
	description: (<React.Fragment>
		Beginner Sailing includes an orientation to CBI, first sail, kayak safety, shore school, and much more. The first week covers all the basics including rigging, safety rules, and sailing maneuvers; everyone will sail our beginner boats, without an instructor. Students will also learn the basics of kayaking in the first couple days so they can paddle with friends during Junior Program hours. The second week continues with more advanced lessons and games designed to challenge and encourage our students. They’ll be on the water every day; we try very hard to keep them active, in the sun, and having fun. Upon completion of the class, sailors will earn a green rating so they can check out a boat during green flag weather.
		<br />
		<br />
		New juniors with prior sailing experience can begin with more advanced classes; please email Niko Kotsatos, Junior Program Director, at <a href="mailto:niko@community-boating.org">niko@community-boating.org</a> if you would like to request advanced placement.<br />
		<br />
		<b>Once you are enrolled in a Beginner Sailing class you will be able to enroll in an Intermediate Sailing class or Paddle Adventure class; sign up first and then check back to this page.</b>
	</React.Fragment>)
}

export default data; 
