import { none, some } from 'fp-ts/lib/Option';
import { createBrowserHistory } from 'history';

import * as React from 'react';
import * as ReactDOM from "react-dom";

import appProps from "./appProps"
import asc from './app/AppStateContainer';
import App from './containers/App';
import { replaceWithOption } from './util/deserializeOption';

export const history = createBrowserHistory()

const seedState = replaceWithOption((window as any).initialStateFromServer)

console.log("seedstate from server: ", seedState)

require("./array-polyfill")

asc.updateState.appProps(appProps);

ReactDOM.render(<App
	history={history}
/>, document.getElementById("root"));

