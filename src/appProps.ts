import { AppProps } from './app/AppStateContainer';

const appProps: AppProps = {
	isServer: true,
	jpDirectorNameFirst: "Niko",
	jpDirectorNameLast: "Kotsatos",
	jpDirectorEmail: "niko@community-boating.org",
	jpPriceCents: 32500,	// TODO: get from welcome pkg
	currentSeason: 2019
}

export default appProps;