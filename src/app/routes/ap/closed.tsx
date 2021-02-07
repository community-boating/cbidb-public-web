import * as React from 'react';
import {apClosedPath} from "../../paths/ap/closed";
import RouteWrapper from "../../../core/RouteWrapper";
import ApClosedSeason from '../../../containers/ap/ApClosedSeason';

export const apClosedPageRoute = new RouteWrapper(true, apClosedPath, history => <ApClosedSeason history={history} />);
