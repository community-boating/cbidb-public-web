import * as React from 'react';

import asc, { AppStateContainer } from 'app/AppStateContainer';
import router from "app/routing";
import {  none } from 'fp-ts/lib/Option';
import {apiw as isLoggedInAsMember} from 'async/is-logged-in-as-member';
import FactaBase, { FactaBaseEmbedded } from 'theme/facta/FactaBase';
import { FOTVPageRoute } from 'app/routes/embedded/fotv';
import { embeddedBase } from 'app/paths/embedded/_base';
import EmbeddedBase from 'theme/embedded/EmbeddedBase';

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
		isLoggedInAsMember.send().then(usernameResult => {
			if (usernameResult.type == "Success") {
				asc.updateState.login.setLoggedIn(usernameResult.success.value)
			}
		}, () => {
			// not logged in
		})
	}
	componentDidMount() {
		// Hide everything to avoid content flicker
		// Page base should unhide when ready
		document.body.style.display = "none";
	}
	render() {
		const self = this;
		const embedded = self.props.history.location.pathname.startsWith(embeddedBase.path);
		if(embedded) {
			return (
				<EmbeddedBase>
					{router(self.props.history)}
				</EmbeddedBase>
			)
		}else{
			return (
				<FactaBase>
					{router(self.props.history)}
				</FactaBase>
			)
		}

	}
}
