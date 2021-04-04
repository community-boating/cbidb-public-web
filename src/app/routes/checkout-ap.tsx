import * as React from 'react';
import RouteWrapper from "@core/RouteWrapper";
import path from "@paths/checkout-ap"
import CheckoutWizard from '@containers/checkout/CheckoutWizard';
import { PageFlavor } from '@components/Page';

export const checkoutPageRoute = new RouteWrapper(true, path, history => <CheckoutWizard history={history} flavor={PageFlavor.AP}/>);
