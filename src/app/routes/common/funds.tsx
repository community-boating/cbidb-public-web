import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/common/funds"
import PageWrapper from 'core/PageWrapper';
import { setCheckoutImage } from 'util/set-bg-image';
import {getWrapper, validator} from "async/donation-funds"
import FundInfoPage from 'containers/checkout/FundInfoPage';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const fundInfoRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="RatingsPage"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <FundInfoPage
		donationFunds={async}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
	getAsyncProps={() => {
		return getWrapper.send().catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
