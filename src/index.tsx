import { none, some } from 'fp-ts/lib/Option';
import { createBrowserHistory } from 'history';

import * as React from 'react';
import * as ReactDOM from "react-dom";
import * as Sentry from '@sentry/browser';

import appProps from "./appProps"
import asc from './app/AppStateContainer';
import App from './containers/App';
import { replaceWithOption } from './util/deserializeOption';

Sentry.init({dsn: (process.env.config as any).sentryDSN});

export const history = createBrowserHistory()

const seedState = replaceWithOption((window as any).initialStateFromServer)

require("./array-polyfill")

asc.updateState.appProps(appProps);

ReactDOM.render(<App
	history={history}
	asc={asc}
/>, document.getElementById("root"));

