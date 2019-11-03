import * as t from 'io-ts';
import * as React from "react";

import { InstanceInfo } from "../async/junior/get-class-instances";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import { ClassAction } from '../containers/class-signup/SelectClassTime';
import PlaceholderLink from './PlaceholderLink';
import { postWrapper as doSignup } from "../async/junior/class-signup"
import { PostJSON } from '../core/APIWrapper';
import { History } from 'history';

interface Props {
	instances: InstanceInfo[],
	juniorId: number,
	history: History<any>,
	setValidationErrors: (errors: string[]) => void,
	url: string
}

// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	makeAction(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, payload: any){
		e.preventDefault();
		return doSignup.send(PostJSON(payload)).then(ret => {
			if (ret.type == "Success") {
				console.log("going to ", `/redirect${this.props.url}`)
				this.props.history.push(`/redirect${this.props.url}`)
			} else {
				window.scrollTo(0, 0);
				this.props.setValidationErrors(ret.message.split("\\n") );
			}
		});
	}
	actionToComponent = (action: ClassAction, instanceId: number, juniorId: number) => {
		switch (action) {
		case ClassAction.BEGUN:
			return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Class has already begun</span>;
		case ClassAction.NOT_AVAILABLE:
			return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Wait&nbsp;List<br />not&nbsp;available</span>;
		case ClassAction.ENROLL:
			return <a href="#" onClick={e => this.makeAction(e, {
				doEnroll: true,
				juniorId,
				instanceId
			})}>Enroll</a>;
		case ClassAction.WAIT_LIST:
			return <a href="#" onClick={e => this.makeAction(e, {
				doEnroll: false,
				juniorId,
				instanceId
			})}>Wait List</a>;
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

	render() {
		return (
			<JoomlaReport
				headers={["First Day", "Last Day", "Class Time", "Spots Left", "Notes", "Action"]}
				rows={this.props.instances.map(c => ([
					c.firstDay,
					c.lastDay,
					c.classTime,
					c.spotsLeft,
					this.actionToComponent(c.action as ClassAction, c.instanceId, this.props.juniorId),
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
