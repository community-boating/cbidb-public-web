import * as t from 'io-ts';
import * as React from "react";

import { InstanceInfo } from "../async/junior/get-class-instances";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import { ClassAction } from '../containers/class-signup/SelectClassTime';
import PlaceholderLink from './PlaceholderLink';
import { postWrapper as doSignup } from "../async/junior/class-signup"
import { PostJSON } from '../core/APIWrapper';

interface Props {
	instances: InstanceInfo[]
}

const actionToComponent = (action: ClassAction, instanceId: number) => {
	switch (action) {
	case ClassAction.BEGUN:
		return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Class has already begun</span>;
	case ClassAction.NOT_AVAILABLE:
		return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Wait&nbsp;List<br />not&nbsp;available</span>;
	case ClassAction.ENROLL:
		return <a href="#" onClick={() => Promise.resolve(doSignup.send(PostJSON({doEnroll: true})))}>Enroll</a>;
	case ClassAction.WAIT_LIST:
		return <a href="#" onClick={() => Promise.resolve(doSignup.send(PostJSON({doEnroll: false})))}>Wait List</a>;
	case ClassAction.UNENROLL:
		return (<React.Fragment>
			<span style={{color: "green", fontWeight: "bold", fontStyle: "italic"}}>Enrolled</span>
			<br />
			(<PlaceholderLink>Unenroll</PlaceholderLink>)
		</React.Fragment>);
	case ClassAction.DELIST:
		return (<React.Fragment>
			<span style={{color: "red", fontWeight: "bold", fontStyle: "italic"}}>Wait&nbsp;Listed</span>
			<br />
			(<PlaceholderLink>Delist</PlaceholderLink>)
		</React.Fragment>);
	default:
		const check: never = action;
		return "";
	}
}


// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaReport
				headers={["First Day", "Last Day", "Class Time", "Spots Left", "Notes", "Action"]}
				rows={this.props.instances.map(c => ([
					c.firstDay,
					c.lastDay,
					c.classTime,
					c.spotsLeft,
					actionToComponent(c.action as ClassAction, c.instanceId),
					c.notes.getOrElse("-")
				]))}
				cellStyles={[
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{}
				]}
				rawHtml={{0: true, 1: true, 3: true, 5: true}}
			/>
		);
	}
}
