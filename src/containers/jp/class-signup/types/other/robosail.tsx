import * as React from "react";
import { ClassType } from "../../class-description";

const data: ClassType = {
	typeId: 601,
	typeName: "RoboSail",
	prereq: "Mercury Green rating, at least 14 years old (by Sept 1)",
	sessionCt: 6,
	sessionLength: 3,
	classSize: 10,
	description: (<React.Fragment>
		CBI-RoboSail combines robotics, coding, and sailing into an exciting engineering challenge! Kids will program a model sailboat (1 m long, 2 m tall) to sail a course. Our students will learn new skills in computer programming, electronics, and mechanisms. They will deepen their understanding of the physical principles and strategies involved in sailing by creating algorithms that translate their sailing knowledge into code for a robot.<br />
		<br />
		Please note that this course spends more time in the classroom than other CBI classes. Students will spend about 2/3 of the class inside, and the other 1/3 outside testing on the water. No prior programming experience is required.
	</React.Fragment>)
}

export default data; 
