import * as React from 'react';
import {jpPathForgotPW} from "../../paths/jp/forgot-pw";
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordPage from '../../../containers/ForgotPasswordPage';

export const forgotPasswordPageRoute = new RouteWrapper(true, jpPathForgotPW, history => <ForgotPasswordPage history={history} />);
