import * as React from 'react';
import {apPathForgotPW} from "@paths/ap/forgot-pw";
import RouteWrapper from "@core/RouteWrapper";
import ForgotPasswordPage from '@containers/ForgotPasswordPage';
import { PageFlavor } from '@components/Page';

export const apForgotPasswordPageRoute = new RouteWrapper(true, apPathForgotPW, history => <ForgotPasswordPage history={history} program={PageFlavor.AP} />);
