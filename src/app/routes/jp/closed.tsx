import * as React from 'react';
import {jpPathClosed} from "@paths/jp/closed";
import RouteWrapper from "@core/RouteWrapper";
import JpRegistrationClosedPage from '@containers/jp/JpRegistrationClosedPage';

export const jpRegClosedPageRoute = new RouteWrapper(true, jpPathClosed, history => <JpRegistrationClosedPage history={history} />);
