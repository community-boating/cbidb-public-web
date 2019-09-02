import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 8,
	typeName: "Windsurfing",
	prereq: "Mercury Yellow Rating",
	sessionCt: 5,
	sessionLength: 2.5,
	classSize: 6,
	description: (<React.Fragment>
		Windsurfers are an entirely different way to get out on the river, combining the balance of a SUP and power of sailing! This class begins with a land-simulator session, to introduce proper form and sail-handling. The class then goes on the water to apply their newly-learned techniques.
	</React.Fragment>)
}

export default data; 
