import * as React from 'react';

import asc, { AppStateContainer } from '../app/AppStateContainer';
import router from "../app/routing";
import JoomlaBase from '../theme/joomla/JoomlaBase';
import {  none } from 'fp-ts/lib/Option';
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
		const self = this;
		asc.setListener(() => {
			self.forceUpdate()
		})
		this.state = {
			loggedInUserName: none
		}
		isLoggedInAsMember.send(null).then(usernameResult => {
			if (usernameResult.type == "Success") {
				asc.updateState.login.setLoggedIn(usernameResult.success.value)
			}
		}, () => {
			// not logged in
		})
	}
	render() {
		const self = this;

		const ret = (
			<React.Fragment>
				{router(self.props.history)}
			</React.Fragment>
		);

		return ret;
	}
}
