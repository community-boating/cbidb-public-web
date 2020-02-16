import * as React from 'react';
import parentPath from './index'
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordSentPage from '../../../containers/ForgotPasswordSent';

const path = parentPath.appendPathSegment("/forgot-pw-sent");

export const forgotPasswordSentPageRoute = new RouteWrapper(true, path, history => <ForgotPasswordSentPage history={history} />);
