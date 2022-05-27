import * as React from 'react';
import {jpPathForgotPW} from "app/paths/jp/forgot-pw";
import RouteWrapper from "core/RouteWrapper";
import ForgotPasswordPage from 'containers/ForgotPasswordPage';
import { PageFlavor } from 'components/Page';

export const jpForgotPasswordPageRoute = new RouteWrapper(true, jpPathForgotPW, history => <ForgotPasswordPage history={history} program={PageFlavor.JP} />);
