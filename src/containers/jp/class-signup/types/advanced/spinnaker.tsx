import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 321,
	typeName: "Spinnaker",
	prereq: "Sonar Green",
	sessionCt: 1,
	sessionLength: 2,
	classSize: 5,
	description: (<React.Fragment>
		Our keelboats provide a stable platform on which to teach spinnaker use, the finer points of sail trim, and to get demonstrations from an instructor in their boat. Advanced topics covered will be based on the week's wind forecast and individual sailors.
	</React.Fragment>)
}

export default data; 
