import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 7,
	typeName: "Environmental Science",
	prereq: "None",
	sessionCt: 3,
	sessionLength: 1.5,
	classSize: 16,
	description: (<React.Fragment>
		Community Boating's Environmental Science program is a STEM program which utilizes sailing as a vessel to explore environmental science, engineering, technology, and math. This program is based off of U.S. Sailing's REACH curriculum, which is a STEM education program created through collaboration between classroom teachers and sailing instructors. Students will have a chance to participate in several experiential learning activities such as building their own anemometer, exploring buoyancy by building clay boats, and learning about weather patterns by creating clouds-in-a-jar.
	</React.Fragment>)
}

export default data; 
