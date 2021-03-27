import * as React from 'react';
import {jpPathForgotPWSent} from "@paths/jp/forgot-pw-sent";
import RouteWrapper from "@core/RouteWrapper";
import ForgotPasswordSentPage from '@containers/ForgotPasswordSent';
import { PageFlavor } from '@components/Page';

export const jpForgotPasswordSentPageRoute = new RouteWrapper(true, jpPathForgotPWSent, history => <ForgotPasswordSentPage history={history} program={PageFlavor.JP} />);
