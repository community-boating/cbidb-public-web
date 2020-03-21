import * as React from 'react';
import path from "../../paths/jp/forgot-pw-sent";
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordSentPage from '../../../containers/ForgotPasswordSent';

export const forgotPasswordSentPageRoute = new RouteWrapper(true, path, history => <ForgotPasswordSentPage history={history} />);
