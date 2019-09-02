import * as t from 'io-ts';
import * as React from "react";

import { validator } from "../async/junior/get-class-instances";
import JoomlaReport from "../theme/joomla/JoomlaReport";

interface Props {
	classes: t.TypeOf<typeof validator>
}

// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	render() {
		return (
			<JoomlaReport
				headers={["Class Name", "First Day", "Last Day", "Class Time", "Spots Left", "Notes"]}
				rows={this.props.classes.map(c => ([
					c.className,
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
					{textAlign: "center"},
					{}
				]}
				rawHtml={{1: true, 2: true, 4: true, 5: true}}
			/>
		);
	}
}