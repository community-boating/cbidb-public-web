import * as React from 'react';
import { postWrapper as doSignup } from "async/junior/class-signup"
import { makePostJSON } from 'core/APIWrapperUtil';
import { jpClassTypeId_BeginnerSailing, jpClassTypeId_intermediate1, jpClassTypeId_intermediate2 } from 'lov/magicStrings';
import { signupNotePageRoute } from 'app/routes/jp/signupNote';
import {History} from 'history'

type ConflictingSignup = {
	instanceId: number
	dateString: string
	timeString: string
}

export const JpSignupError = (props: {
	personId: number,
	typeId: number,
	instanceId: number,
	path: string,
	history: History,
	conflictingSignups: ConflictingSignup[],
	errs: string[],
	setValidationErrors: (errors: string[]) => void
}) => {
	const self = this;
	// if there is exactly one error, and it is about other wait lists, render a menu of links to delist from those instances
	return props.errs.map((e, i) => {
		if (e.indexOf("other wait lists") > -1 && props.errs.length == 1) {
			return <>
				<br />
				<div>
					<ul>
						{props.conflictingSignups.map(i => <li>
							<a href="#" onClick={e => {
								e.preventDefault()
								return doSignup.sendJson({
									doEnroll: true,
									instanceId: props.instanceId,
									juniorId: props.personId,
									keepInstanceId: i.instanceId,
									deleteEnrollment: false
								}).then(ret => {
									if (ret.type == "Success") {
										const url = (
											(props.typeId == jpClassTypeId_BeginnerSailing || props.typeId == jpClassTypeId_intermediate1 || props.typeId == jpClassTypeId_intermediate2)
											? signupNotePageRoute.getPathFromArgs({ personId: String(props.personId), instanceId: String(props.instanceId) })
											: `/redirect${props.path}`
										);
										props.history.push(url)
									} else {
										props.setValidationErrors(ret.message.split("\\n"))
									}
								});
							}}>Click here to delist from all except {i.dateString} {i.timeString}</a>
						</li>)}
						<li><a href="#" onClick={e => {
								e.preventDefault()
								return doSignup.sendJson({
									doEnroll: true,
									instanceId: props.instanceId,
									juniorId: props.personId,
									keepInstanceId: -1,
									deleteEnrollment: false
								}).then(ret => {
									if (ret.type == "Success") {
										const url = (
											(props.typeId == jpClassTypeId_BeginnerSailing || props.typeId == jpClassTypeId_intermediate1 || props.typeId == jpClassTypeId_intermediate2)
											? signupNotePageRoute.getPathFromArgs({ personId: String(props.personId), instanceId: String(props.instanceId) })
											: `/redirect${props.path}`
										);
										props.history.push(url)
									} else {
										props.setValidationErrors(ret.message.split("\\n"))
									}
								});
							}}>Click here to delist from all</a></li>
					</ul>
				</div>
			</>
		} else if (e.indexOf("already enrolled") > -1 && props.errs.length == 1) {
			return <>
				<br />
				<div>
					<ul>
						<li><a href="#" onClick={e => {
								e.preventDefault()
								return doSignup.sendJson({
									doEnroll: true,
									instanceId: props.instanceId,
									juniorId: props.personId,
									keepInstanceId: -1,
									deleteEnrollment: true
								}).then(ret => {
									if (ret.type == "Success") {
										const url = (
											(props.typeId == jpClassTypeId_BeginnerSailing || props.typeId == jpClassTypeId_intermediate1 || props.typeId == jpClassTypeId_intermediate2)
											? signupNotePageRoute.getPathFromArgs({ personId: String(props.personId), instanceId: String(props.instanceId) })
											: `/redirect${props.path}`
										);
										props.history.push(url)
									} else {
										props.setValidationErrors(ret.message.split("\\n"))
									}
								});
							}}>Click here to swap into this class (your other enrollment will be cancelled)</a></li>
					</ul>
				</div>
			</>
		} else return null;
	});
}