import * as React from "react";
import { ClassType } from "../../class-description";


const data: ClassType = {
	typeId: 1402,
	typeName: "Water Quality Lab",
	prereq: "At least 12 years old (by 9/1)",
	sessionCt: 8,
	sessionLength: 3,
	classSize: 12,
	description: (<React.Fragment>
		The Charles River makes up a part of a vibrant ecosystem in which people also play an impactful role. Water quality is a byproduct of interactions within that ecosystem, including temperature, precipitation, and human activity. In this weekly 3 hour long class, kids who are at least twelve-years-old will learn about these processes through a hands-on learning lab. They will take water samples, evaluate them using a variety of testing methods, and contribute their data to public knowledge, both locally to our Boston community and nationally through the EPA's Citizen Science program. <br />
		<br />
		The class runs every Tuesday for 7 weeks. Absences are discouraged, but should be communicated to the instructor, Ira, at <a href="emailto:ira@community-boating.org">ira@community-boating.org</a>. Permission slips are required, and can be found at the Front Office. Please return them to the Front Office in person or by email.
	</React.Fragment>)
}

export default data; 
