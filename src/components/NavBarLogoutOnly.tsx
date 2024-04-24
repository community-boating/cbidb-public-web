import * as React from "react";

import asc from "app/AppStateContainer";
import { logout } from "async/logout";
import { History } from "history";
import { Moment } from "moment";
import { Option } from "fp-ts/lib/Option";
import { Link } from "react-router-dom";
import {apBasePath} from "app/paths/ap/_base"
import {jpBasePath} from "app/paths/jp/_base"
import { apSettingsPagePath } from "app/paths/ap/settings";
import { jpSettingsPagePath } from "app/paths/jp/settings";

export default (props: {history: History<any>, sysdate: Option<Moment>, showProgramLink: boolean}) => {
	const pathComponents = props.history.location.pathname.split("/");
	const program = pathComponents[1];
	const switchLink = (function() {
		if (props.showProgramLink && program == "jp") {
			return <Link key="ap" to={apBasePath.getPathFromArgs({})}>&nbsp;&nbsp;&nbsp;Adult Program</Link>;
		} else if (props.showProgramLink && program == "ap") {
			return <Link key="jp" to={jpBasePath.getPathFromArgs({})}>&nbsp;&nbsp;&nbsp;Junior Program</Link>;
		} else return null;
	}());

	const logoutLink = (
		program == 'ap'
		? apBasePath.getPathFromArgs({})
		: jpBasePath.getPathFromArgs({})
	);

	const settingsPage = (
		program == 'ap'
		? <Link key="settings" to={apSettingsPagePath.getPathFromArgs({})}>&nbsp;&nbsp;&nbsp;Change Email/Password</Link>
		: <Link key="settings" to={jpSettingsPagePath.getPathFromArgs({})}>&nbsp;&nbsp;&nbsp;Change Email/Password</Link>
	);

	const navComponents = [
		props.sysdate.map(d => <React.Fragment key="sysdate">System Time:  <span id="systime">{d.format("hh:mm:ss A")}</span> (refresh your browser to update!)</React.Fragment>)
		.getOrElse(null),
		switchLink,
		settingsPage,
		<a key="logout" href="#" onClick={() => {
			logout.sendJson({}).then(() => {
				asc.updateState.login.logout()
			})
			props.history.push(logoutLink);
		}}>&nbsp;&nbsp;&nbsp;Logout</a>
	].filter(Boolean);
	return (<React.Fragment>
		{navComponents}
	</React.Fragment>);
}
