import * as React from 'react';
import parentPath from './index'
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordPage from '../../../containers/ForgotPasswordPage';

const path = parentPath.appendPathSegment("/forgot-pw");

export const forgotPasswordPageRoute = new RouteWrapper(true, path, history => <ForgotPasswordPage history={history} />);
