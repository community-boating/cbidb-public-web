import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 21,
	typeName: "Laser",
	prereq: "Mercury Red Rating",
	sessionCt: 5,
	sessionLength: 2.5,
	classSize: 6,
	description: (<React.Fragment>
		The Laser is a fast, fun boat for a single sailor. This class covers how to rig the Laser as well as skills tailored for it. Sailors will also learn to right a capsize and be introduced to the basics of racing. Students should be prepared to get wet, so make sure to bring a change of clothes. While many sailors will receive their green Laser rating upon completion of this class, that will depend on their ability to effectively rig, sail and right the Laser on their own, which is a physical task but required for safe sailing.
	</React.Fragment>)
}

export default data; 
