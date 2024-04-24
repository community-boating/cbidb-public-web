import * as React from "react";

import { InstanceInfo } from "async/junior/get-class-instances";
import StandardReport from "theme/facta/StandardReport";
import { ClassAction } from 'containers/jp/class-signup/SelectClassTime';
import { postWrapper as doSignup } from "async/junior/class-signup"
import { postWrapper as deleteSignup } from "async/junior/class-signup-delete"
import APIWrapper from 'core/APIWrapper';
import { makePostJSON } from 'core/APIWrapperUtil';
import { History } from 'history';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_intermediate1, jpClassTypeId_intermediate2 } from 'lov/magicStrings';
import assertNever from "util/assertNever";
import {signupNotePageRoute} from "app/routes/jp/signupNote"
import { Option } from "fp-ts/lib/Option";

interface Props {
	typeId: Option<number>,
	instances: InstanceInfo[],
	juniorId: Option<number>,
	history: History<any>,
	setValidationErrors: (errors: string[]) => void,
	setClickedInstance: (clickedInstance: number) => void,
	url: string
}

// TODO: redo this without having to use dangerouslySetInnerHTML
export default class JpClassesAvailTable extends React.PureComponent<Props> {
	makeAction(instanceId: number, goToNote: boolean, apiw: APIWrapper<any, any, any>, e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, payload: any){
		const self = this;
		e.preventDefault();
		return apiw.sendJson(payload).then(ret => {
			if (ret.type == "Success") {
				const typeId = self.props.typeId.getOrElse(-1)
				const url = (
					goToNote && (typeId == jpClassTypeId_BeginnerSailing || typeId == jpClassTypeId_intermediate1 || typeId == jpClassTypeId_intermediate2)
					? signupNotePageRoute.getPathFromArgs({ personId: String(self.props.juniorId.getOrElse(null)), instanceId: String(instanceId) })
					: `/redirect${this.props.url}`
				);
				this.props.history.push(url)
			} else {
				window.scrollTo(0, 0);
				this.props.setClickedInstance(instanceId)
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
		const includeAction = this.props.juniorId.isSome();
		const notesIndex = includeAction ? 7 : 6
		return (
			<StandardReport
				headers={["Week", "Class Name", "First Day", "Last Day", "Class Time", "Spots Left"]
					.concat(includeAction ? ["Action"] : [])
					.concat(["Notes"])
				}
				rows={this.props.instances.map(c => (([
					"Week " + c.week,
					c.className,
					c.firstDay,
					c.lastDay,
					c.classTime,
					c.spotsLeft
				] as React.ReactNode[]).concat(
					includeAction
					? [this.actionToComponent(c.action as ClassAction, c.instanceId, this.props.juniorId.getOrElse(null))]
					: []
				).concat([c.notes.getOrElse("-")])
				))}
				cellStyles={([
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"},
					{textAlign: "center"}
				] as React.CSSProperties[])
					.concat(includeAction ? [{textAlign: "center"}] : [])
					.concat([{}])
				}
				rawHtml={{2: true, 3: true, 5: true, [notesIndex]: true}}
			/>
		);
	}
}
