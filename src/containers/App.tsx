import * as React from 'react';

import asc, { AppStateContainer } from '../app/AppStateContainer';
import router from "../app/routing";
import JoomlaBase from '../theme/joomla/JoomlaBase';
import { Option, some, none } from 'fp-ts/lib/Option';
import {apiw as isLoggedInAsMember} from '../async/is-logged-in-as-member';

interface Props {
	history: any
	asc: AppStateContainer
}

// TODO: make a wizard manager, call its update() in App constructor and SCU,
// wizard routes just call that route in the WM which returns HomePage if that route is not active in the WM
export default class App extends React.Component<Props> {
	registrationWizard: React.ComponentType
	constructor(props: Props) {
		super(props)
		console.log("in app constructor")
		const self = this;
		asc.setListener(() => {
			console.log("asc updated; rerendering App")
			self.forceUpdate()
		})
		this.state = {
			loggedInUserName: none
		}
		isLoggedInAsMember.send(null).then(usernameResult => {
			console.log("is logged in came back....", usernameResult)
			if (usernameResult.type == "Success") {
				console.log("SETTING LOGGED IN:   " + usernameResult.success.value)
				asc.updateState.login.setLoggedIn(usernameResult.success.value)
			}
		}, () => {
			// not logged in
		})
	}
	render() {
		console.log("=========================================== in app render")
		const self = this;

		const ret = (
			<JoomlaBase>
				{router(self.props.history)}
			</JoomlaBase>
		);

		return ret;
	}
}
