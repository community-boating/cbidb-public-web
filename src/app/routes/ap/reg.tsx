import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/ap/reg";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { validator as welcomeAPValidator, apiw as welcomeAPIAP } from "@async/member-welcome-ap";
import { setAPImage } from '../../../util/set-bg-image';
import ApRegistrationWizard from '../../../containers/ap/ap-registration/ApRegistrationWizard';
import { apBasePath } from '../../paths/ap/_base';
import { hasStripeCustomerId } from '../../../containers/ap/HomePageActionsAP';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

export const apRegPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="reg"
	history={history}
	component={(urlProps: { personId: number }, async: t.TypeOf<typeof welcomeAPValidator>) => <ApRegistrationWizard
		history={history}
		start={apBasePath.getPathFromArgs({})}
		end={apBasePath.getPathFromArgs({})}
		editOnly={false}
		currentSeason={async.season}
		hasStripeCustomerId={hasStripeCustomerId(async.actions)}
	/>}
	urlProps={{
		personId: Number(path.extractURLParams(history.location.pathname).personId),
	}}
	getAsyncProps={(urlProps: {}) => {
		return welcomeAPIAP.send(null).catch(err => Promise.resolve(null));
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
