import * as React from "react";

import { InstanceInfo } from "../async/junior/get-class-instances";
import JoomlaReport from "../theme/joomla/JoomlaReport";
import { ClassAction } from '../containers/class-signup/SelectClassTime';
import { postWrapper as doSignup } from "../async/junior/class-signup"
import { postWrapper as deleteSignup } from "../async/junior/class-signup-delete"
import APIWrapper, { PostJSON } from '../core/APIWrapper';
import { History } from 'history';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_IntermediateSailing } from '../lov/magicStrings';
import assertNever from "../util/assertNever";
import {signupNotePageRoute} from "../app/routes/jp/signupNote"

interface Props {
	typeId: number,
	instances: InstanceInfo[],
	juniorId: number,
	history: History<any>,
	setValidationErrors: (errors: string[]) => void,
	url: string
}

// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	makeAction(instanceId: number, goToNote: boolean, apiw: APIWrapper<any, any, any>, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, payload: any){
		const self = this;
		e.preventDefault();
		return apiw.send(PostJSON(payload)).then(ret => {
			if (ret.type == "Success") {
				const url = (
					goToNote && (self.props.typeId == jpClassTypeId_BeginnerSailing || self.props.typeId == jpClassTypeId_IntermediateSailing)
					? signupNotePageRoute.getPathFromArgs({ personId: String(self.props.juniorId), instanceId: String(instanceId) })
					: `/redirect${this.props.url}`
				);
				this.props.history.push(url)
			} else {
				window.scrollTo(0, 0);
				this.props.setValidationErrors(ret.message.split("\\n") );
			}
		});
	}
	actionToComponent = (action: ClassAction, typeId: number, instanceId: number, juniorId: number) => {
		switch (action) {
		case ClassAction.BEGUN:
			return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Class has already begun</span>;
		case ClassAction.NOT_AVAILABLE:
			return <span style={{fontWeight: "bold", color: "#777", fontStyle: "italic"}}>Wait&nbsp;List<br />not&nbsp;available</span>;
		case ClassAction.ENROLL:
			return <a href="#" onClick={e => this.makeAction(instanceId, true, doSignup, e, {
				doEnroll: true,
				juniorId,
				instanceId
			})}>Enroll</a>;
		case ClassAction.WAIT_LIST:
			return <a href="#" onClick={e => this.makeAction(instanceId, true, doSignup, e, {
				doEnroll: false,
				juniorId,
				instanceId
			})}>Wait List</a>;
		case ClassAction.UNENROLL:
			return (<React.Fragment>
				<span style={{color: "green", fontWeight: "bold", fontStyle: "italic"}}>Enrolled</span>
				<br />
				<a href="#" onClick={e => {
					e.preventDefault();
					if (confirm("Are you sure you want to unenroll from this class?  Your seat will be permanently lost and this cannot be undone.")) {
						this.makeAction(instanceId, false, deleteSignup, e, {
							juniorId,
							instanceId
						});
					}
				}}>Unenroll</a>
			</React.Fragment>);
		case ClassAction.DELIST:
			return (<React.Fragment>
				<span style={{color: "red", fontWeight: "bold", fontStyle: "italic"}}>Wait&nbsp;Listed</span>
				<br />
				<a href="#" onClick={e => {
					e.preventDefault();
					if (confirm("Are you sure you want to leave this wait list?  Your place in line will be permanently lost and this cannot be undone.")) {
						this.makeAction(instanceId, false, deleteSignup, e, {
							juniorId,
							instanceId
						});
					}
				}}>Delist</a>
			</React.Fragment>);
		default:
			assertNever(action);
			return "";
		}
	}

	render() {
		const self = this;
		return (
			<JoomlaReport
				headers={["First Day", "Last Day", "Class Time", "Spots Left", "Notes", "Action"]}
				rows={this.props.instances.map(c => ([
					c.firstDay,
					c.lastDay,
					c.classTime,
					c.spotsLeft,
					this.actionToComponent(c.action as ClassAction, self.props.typeId, c.instanceId, this.props.juniorId),
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
