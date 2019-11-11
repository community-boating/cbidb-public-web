import * as React from "react";

import asc from "../app/AppStateContainer";
import { logout } from "../async/logout";
import PlaceholderLink from "./PlaceholderLink";
import { History } from "history";
import { Moment } from "moment";


export default (props: {history: History<any>, sysdate: Moment}) => (<React.Fragment>
	System Time:  <span id="systime">{props.sysdate.format("hh:mm:ss A")}</span> (refresh your browser to update!)
	<PlaceholderLink>&nbsp;&nbsp;&nbsp;Adult Program</PlaceholderLink>
	<a href="#" onClick={() => {
		logout.send({type: "json", jsonData: {}}).then(() => {
			asc.updateState.login.logout()
		})
		props.history.push("/");
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);