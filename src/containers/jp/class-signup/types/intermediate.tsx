import * as React from "react";
import { ClassType } from "../class-description";

const data: ClassType = {
	typeId: 1381,
	typeName: "One Week Intermediate",
	prereq: "Mercury Green Rating or previous experience",
	sessionCt: 5,
	sessionLength: 2.5,
	classSize: 12,
	description: (<React.Fragment>
		Intermediate Sailing teaches new skills while also polishing the techniques introduced in Beginner Sailing.
		Sailing in pairs, students refine their positioning and sail trim, improve their maneuvers and control, and learn to use a jib,
		all through a combination of lessons and structured play. The curriculum focuses on sail trim, boat handling, upwind sailing,
		and skills needed to sail in heavier winds, including reefing. If Juniors are ready, we can also introduce the second Mercury sail,
		the jib. When a jib is added to the mix, sailing becomes even more fun and sailors really learn to work together as skipper and crew.
		By the end of the week, if a Junior displays competence in the skills above, they may receive their Yellow Rating,
		which indicates their ability to sail in moderate wind, or even their Red Rating, which indicates their ability to sail in heavy wind with a jib.
		<br /><br />
		Juniors who are just moving up to the Intermediate level this year are encouraged to take it twice.
		If you think your junior is ready to receive their Red Rating by the end of a One-Week Intermediate,
		keep in mind that the Red Rating would qualify someone to take a one-week advanced class.
	</React.Fragment>)
}

export default data; 
