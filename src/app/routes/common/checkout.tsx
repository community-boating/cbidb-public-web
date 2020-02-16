import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PathWrapper from '../../../core/PathWrapper';
import CheckoutWizard from '../../../containers/checkout/CheckoutWizard';

const path = new PathWrapper("/checkout");

export const checkoutPageRoute = new RouteWrapper(true, path, history => <CheckoutWizard history={history} />);
