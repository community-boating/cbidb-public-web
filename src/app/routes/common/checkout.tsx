import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import path from "../../paths/common/checkout"
import CheckoutWizard from '../../../containers/checkout/CheckoutWizard';

export const checkoutPageRoute = new RouteWrapper(true, path, history => <CheckoutWizard history={history} />);
