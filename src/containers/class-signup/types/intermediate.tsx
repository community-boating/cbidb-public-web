import * as React from "react";
import { ClassType } from "../class-description";


const data: ClassType = {
	typeId: 1222,
	typeName: "Intermediate Sailing",
	prereq: "Mercury Green Rating or previous experience",
	sessionCt: 10,
	sessionLength: 3,
	classSize: 16,
	description: (<React.Fragment>
		Intermediate Sailing teaches new skills while also polishing the techniques introduced in Beginner Sailing. Students refine their positioning and sail trim, improve their maneuvers and control, and learn to use a jib, all through a combination of lessons and structured play. The first week focuses on sail trim, boat handling, upwind sailing, and skills needed to sail in heavier winds, including reefing. By week 2, we introduce the second Mercury sail, the jib. When a jib is added to the mix, sailing becomes even more fun and sailors really learn to work together as skipper and crew.
	</React.Fragment>)
}

export default data; 
