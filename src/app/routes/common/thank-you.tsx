import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import path from "../../paths/common/thank-you"
import ThankYouPage from '../../../containers/checkout/ThankYou';

export const thankyouPageRoute = new RouteWrapper(true, path, () => <ThankYouPage />);
