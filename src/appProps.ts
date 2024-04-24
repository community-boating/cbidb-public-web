import { AppProps } from './app/AppStateContainer';
import { PostString } from './core/APIWrapperTypes';
import {apiw as login} from "./async/authenticate-member"
import asc from './app/AppStateContainer';

const appProps: AppProps = {
	isServer: true,
	jpDirectorNameFirst: "Fiona",
	jpDirectorNameLast: "O'Connor",
	jpDirectorEmail: "fiona@community-boating.org",
	jpPriceCents: 32500,	// TODO: get from welcome pkg
	attemptLoginFunction: (userName: string, payload: PostString) => {
		return login().send().then(res => {
			if (res.type == "Success" && res.success) {
				asc.updateState.login.setLoggedIn(userName);
				return true;
			} else return false;
		})
	}
}

export default appProps;
