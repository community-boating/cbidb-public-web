import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import ForgotPasswordPage from '../../../containers/ForgotPasswordPage';
import { PageFlavor } from '../../../components/Page';
import { apPathAddons } from '../../paths/ap/addons';

export const apAddonsPageRoute = new RouteWrapper(true, apPathAddons, history => <ForgotPasswordPage history={history} program={PageFlavor.AP} />);
