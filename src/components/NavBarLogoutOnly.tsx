import * as React from "react";

import asc from "../app/AppStateContainer";
import { logout } from "../async/logout";
import PlaceholderLink from "./PlaceholderLink";


export default () => (<React.Fragment>
	System Time:  <span id="systime">12:12:35 PM</span> (refresh your browser to update!)
	<PlaceholderLink>&nbsp;&nbsp;&nbsp;Adult Program</PlaceholderLink>
	<a href="#" onClick={() => {
		console.log("clicked logout!")
		logout.send({type: "json", jsonData: {}}).then(() => {
			asc.updateState.login.logout()
		})
	}}>&nbsp;&nbsp;&nbsp;Logout</a>
</React.Fragment>);