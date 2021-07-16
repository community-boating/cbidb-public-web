import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 7,
	typeName: "Environmental Science",
	prereq: "None",
	sessionCt: 3,
	sessionLengthMinutes: 75,
	classSize: 16,
	description: (<React.Fragment>
		Community Boating's Environmental Science and Physics of Sailing program is a STEM program which utilizes sailing as a vessel to explore physics, environmental science, and how they both govern interactions within ecosystems. This program is in part based off of U.S. Sailing's REACH curriculum, which is a STEM education program created through collaboration between classroom teachers and sailing instructors. Students will have a chance to participate in several experiential learning activities such as building their own anemometer, exploring buoyancy by creating clay boats, and constructing their own water sampling tools. In addition, students will get hands on training and practice with microscopes, slide preparation, water quality testing, and flourometers.
	</React.Fragment>)
}

export default data; 
