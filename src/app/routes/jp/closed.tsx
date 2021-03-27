import * as React from 'react';
import {jpPathClosed} from "@paths/jp/closed";
import RouteWrapper from "@core/RouteWrapper";
import ClosedCovid from '@containers/jp/ClosedCovid';

export const jpClosedCovidPageRoute = new RouteWrapper(true, jpPathClosed, history => <ClosedCovid history={history} />);
