import 'react-app-polyfill/ie11';
// Above must be the first line

import { createBrowserHistory } from 'history';

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as Sentry from '@sentry/react';

import appProps from "./appProps"
import asc from './app/AppStateContainer';
import App from './containers/App';

const sentryKey = (process.env.config as any).sentryDSN;
if (sentryKey) {
	console.log("SARTING")
	Sentry.init({dsn: sentryKey,
		integrations: [
			Sentry.feedbackIntegration({
				colorScheme: "system"
			})
		]
	});
}
console.log(sentryKey)
console.log("NOT SARTING")

export const history = createBrowserHistory()

// const seedState = replaceWithOption((window as any).initialStateFromServer)

require("./array-polyfill")

asc.updateState.appProps(appProps);

ReactDOM.render(<App
	history={history}
	asc={asc}
/>, document.getElementById("root"));

