import { none, Option, some } from 'fp-ts/lib/Option';

import { apiw } from "../async/authenticate-member";
import { PostString, ServerParams } from '../core/APIWrapper';

// TODO: some sort of state module class that creates reducers with current state and this.setState injected into them somehow


type ServerConfig = {
    // TODO: dev vs prod config

    SELF: {
        host: string,
        https: boolean,
        pathPrefix: string,
        port: number
    },
    API: {
        host: string,
        https: boolean,
        port: number
    }
}

export interface AppProps {
	isServer: boolean,
	jpDirectorNameFirst: string,
	jpDirectorNameLast: string,
	jpDirectorEmail: string,
	jpPriceCents: number,
	currentSeason: number,
	apiServerParams: ServerParams,
	selfServerParams: ServerParams,
	serverConfig: ServerConfig,
	serverToUseForAPI: ServerParams
}

type State = {
	appProps: AppProps
	login: {
		authenticatedUserName: Option<string>
	}
}

// TODO: should this not expose anything publically except the "reducer" functions to update state?  Seems like <App /> should be the only thing that can read state
// and it should have to inheret downward
class AppStateContainer {
	state: State
	setState = (state: State) => {
		this.state = state;
		console.log("asc updated state: ", this.state)
		if (this.listener) this.listener();
	}
	listener: () => void
	setListener=(listener: () => void) => {
		this.listener = listener
	}
	poke() {
		console.log("poking asc!")
		this.setState(this.state);
	}
	updateState = {
		login: {
			setLoggedIn: (function(userName: string) {
				const self: AppStateContainer = this
				self.setState({
					...self.state,
					login: {
						...self.state.login,
						authenticatedUserName: some(userName)
					}
				})
			}).bind(this),
			attemptLogin: (function(userName: string, password: string): Promise<boolean> {
				const self: AppStateContainer = this
				const payload = PostString("username=" + encodeURIComponent(userName) + "&password=" + encodeURIComponent(password))
				return apiw().send(payload).then(res => {
					if (res.type == "Success" && res.success) {
						self.updateState.login.setLoggedIn(userName);
						return true;
					} else return false;
				})
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
			}
		};
	}
}

const asc = new AppStateContainer();
export default asc;