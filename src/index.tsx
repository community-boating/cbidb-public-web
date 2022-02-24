import 'react-app-polyfill/ie11';
// Above must be the first line

import { createBrowserHistory } from 'history';

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as Sentry from '@sentry/browser';

import appProps from "./appProps"
import asc from './app/AppStateContainer';
import App from './containers/App';

const sentryKey = (process.env.config as any).sentryDSN;
if (sentryKey) {
	Sentry.init({dsn: sentryKey});
}

export const history = createBrowserHistory()

// const seedState = replaceWithOption((window as any).initialStateFromServer)

require("./array-polyfill")

asc.updateState.appProps(appProps);

ReactDOM.render(<App
	history={history}
	asc={asc}
/>, document.getElementById("root"));

