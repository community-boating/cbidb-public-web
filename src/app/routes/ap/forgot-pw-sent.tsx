import * as React from 'react';
import {apPathForgotPWSent} from "app/paths/ap/forgot-pw-sent";
import RouteWrapper from "core/RouteWrapper";
import ForgotPasswordSentPage from 'containers/ForgotPasswordSent';
import { PageFlavor } from 'components/Page';

export const apForgotPasswordSentPageRoute = new RouteWrapper(true, apPathForgotPWSent, history => <ForgotPasswordSentPage history={history} program={PageFlavor.AP} />);
