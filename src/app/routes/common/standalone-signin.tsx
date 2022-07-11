import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from "core/RouteWrapper";
import path from "app/paths/common/standalone-signin"
import PageWrapper from 'core/PageWrapper';
import { setCheckoutImage } from 'util/set-bg-image';
import {getWrapper, validator} from "async/donation-funds"
import StandaloneLoginPage from 'containers/checkout/StandaloneLoginPage';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const standaloneLoginRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="StandaloneLoginPage"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <StandaloneLoginPage
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
	getAsyncProps={() => {
		return getWrapper.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
