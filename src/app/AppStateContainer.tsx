import { none, Option, some } from 'fp-ts/lib/Option';
import * as Sentry from '@sentry/browser';

import { makePostString } from '../core/APIWrapperUtil';
import { PostString } from '../core/APIWrapperTypes';

// TODO: some sort of state module class that creates reducers with current state and this.setState injected into them somehow

// type ServerConfig = {
//     // TODO: dev vs prod config

//     SELF: {
//         host: string,
//         https: boolean,
//         pathPrefix: string,
//         port: number
//     },
//     API: {
//         host: string,
//         https: boolean,
//         port: number
//     }
// }

export interface AppProps {
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	attemptLoginFunction: (userName: string, payload: PostString) => Promise<boolean>
}

type State = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>
	},
	justLoggedIn: boolean,
	jpClosedCovid: boolean
}

// TODO: should this not expose anything publically except the "reducer" functions to update state?  Seems like <App /> should be the only thing that can read state
// and it should have to inheret downward
export class AppStateContainer {
	state: State
	setState = (state: State) => {
		this.state = state;
		if (this.listener) this.listener();
	}
	listener: () => void
	setListener=(listener: () => void) => {
		this.listener = listener
	}
	updateState = {
		setJustLoggedIn: (justLoggedIn: boolean) => {
			this.setState({
				...this.state,
				justLoggedIn
			})
		},
		login: {
			setLoggedIn: (function(userName: string) {
				const self: AppStateContainer = this
				self.setState({
					...self.state,
					login: {
						...self.state.login,
						authenticatedUserName: some(userName)
					}
				});
				Sentry.configureScope(function(scope) {
					scope.setUser({"username": userName});
				});
			}).bind(this),
			attemptLogin: (function(userName: string, password: string): Promise<boolean> {
				const self: AppStateContainer = this
				const payload = makePostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return self.state.appProps.attemptLoginFunction(userName, payload);
			}).bind(this),
			logout: () => {
				this.setState({
					...this.state,
					login: {
						authenticatedUserName: none
					}
				})
			}
		},
		appProps: (appProps: AppProps) => {
			this.setState({
				...this.state,
				appProps
			})
		}
	}
	constructor() {
		this.state = {
			appProps: null,
			login: {
				authenticatedUserName: none
			},
			justLoggedIn: false,
			jpClosedCovid: false
		};
	}
}

const asc = new AppStateContainer();
export default asc;
