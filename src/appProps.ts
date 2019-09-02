import { AppProps } from './app/AppStateContainer';

const serverConfig = require("./server")

const appProps: AppProps = {
	isServer: true,
	jpDirectorNameFirst: "Niko",
	jpDirectorNameLast: "Kotsatos",
	jpDirectorEmail: "niko@community-boating.org",
	jpPriceCents: 32500,	// TODO: get from welcome pkg
	currentSeason: 2019,
	serverConfig,
	selfServerParams: {
		...serverConfig.SELF,
		//makeRequest: (serverConfig.SELF.https ? https.request : http.request),
		//port: (serverConfig.SELF.https ? 443 : 80)
	},
	apiServerParams: {
		...serverConfig.API,
	//	makeRequest: (serverConfig.API.https ? https.request : http.request),
	},
	serverToUseForAPI: serverConfig.SELF
}

export default appProps;