import * as React from 'react';
import {jpPathForgotPWSent} from "../../paths/jp/forgot-pw-sent";
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordSentPage from '../../../containers/ForgotPasswordSent';

export const forgotPasswordSentPageRoute = new RouteWrapper(true, jpPathForgotPWSent, history => <ForgotPasswordSentPage history={history} />);
