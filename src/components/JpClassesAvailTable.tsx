import * as t from 'io-ts';
import * as React from "react";

import { InstanceInfo } from "../async/junior/get-class-instances";
import JoomlaReport from "../theme/joomla/JoomlaReport";

interface Props {
	instances: InstanceInfo[]
}

// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaReport
				headers={["First Day", "Last Day", "Class Time", "Spots Left", "Notes"]}
				rows={this.props.instances.map(c => ([
					c.firstDay,
					c.lastDay,
					c.classTime,
					c.spotsLeft,
					c.notes.getOrElse("-")
				]))}
				cellStyles={[
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{}
				]}
				rawHtml={{0: true, 1: true, 3: true, 4: true}}
			/>
		);
	}
}
