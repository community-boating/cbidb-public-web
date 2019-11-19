import * as React from "react";

import asc from "../app/AppStateContainer";
import { logout } from "../async/logout";
import { History } from "history";
import { Moment } from "moment";
import { Option } from "fp-ts/lib/Option";


export default (props: {history: History<any>, sysdate: Option<Moment>}) => (<React.Fragment>
	{
		props.sysdate.map(d => <React.Fragment>System Time:  <span id="systime">{d.format("hh:mm:ss A")}</span> (refresh your browser to update!)</React.Fragment>)
		.getOrElse(null)
	}
	<a href="#" onClick={() => {
		logout.send({type: "json", jsonData: {}}).then(() => {
			asc.updateState.login.logout()
		})
		props.history.push("/");
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);