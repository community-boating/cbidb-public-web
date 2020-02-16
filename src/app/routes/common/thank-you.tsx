import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PathWrapper from '../../../core/PathWrapper';
import ThankYouPage from '../../../containers/checkout/ThankYou';

const path = new PathWrapper("/thank-you");

export const thankyouPageRoute = new RouteWrapper(true, path, () => <ThankYouPage />);
