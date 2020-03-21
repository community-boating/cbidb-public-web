import * as React from 'react';
import path from "../../paths/jp/forgot-pw";
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordPage from '../../../containers/ForgotPasswordPage';

export const forgotPasswordPageRoute = new RouteWrapper(true, path, history => <ForgotPasswordPage history={history} />);
