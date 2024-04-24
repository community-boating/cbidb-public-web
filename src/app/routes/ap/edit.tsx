import * as React from 'react';
import * as t from 'io-ts';
import path from "app/paths/ap/edit";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { validator as welcomeAPValidator, apiw as welcomeAPIAP } from "async/member-welcome-ap";
import { setAPImage } from 'util/set-bg-image';
import ApRegistrationWizard from 'containers/ap/ap-registration/ApRegistrationWizard';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { apBasePath } from 'app/paths/ap/_base';
import { hasStripeCustomerId } from 'containers/ap/HomePageActionsAP';

export const apEditPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="edit"
	history={history}
	component={(urlProps: { personId: number }, async: t.TypeOf<typeof welcomeAPValidator>) => <ApRegistrationWizard
		history={history}
		start={apBasePath.getPathFromArgs({})}
		end={apBasePath.getPathFromArgs({})}
		editOnly={true}
		currentSeason={async.season}
		hasStripeCustomerId={hasStripeCustomerId(async.actions)}
		canRenew={async.discountsResult.canRenew}
	/>}
	urlProps={{
		personId: Number(path.extractURLParams(history.location.pathname).personId),
	}}
	getAsyncProps={(urlProps: {}) => {
		return welcomeAPIAP.send().catch(err => Promise.resolve(null));
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
