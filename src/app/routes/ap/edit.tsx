import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/ap/edit";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { validator as welcomeJPValidator } from "../../../async/member-welcome-ap";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApRegistrationWizard from '../../../containers/ap/ap-registration/ApRegistrationWizard';
import { apBasePath } from '../../paths/ap/_base';
import { hasStripeCustomerId } from '../../../containers/ap/HomePageActionsAP';

export const apEditPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="edit"
	history={history}
	component={(urlProps: { personId: number }, async: t.TypeOf<typeof welcomeJPValidator>) => <ApRegistrationWizard
		history={history}
		start={apBasePath.getPathFromArgs({})}
		end={apBasePath.getPathFromArgs({})}
		editOnly={true}
		currentSeason={async.season}
		hasStripeCustomerId={hasStripeCustomerId(async.actions)}
	/>}
	urlProps={{
		personId: Number(path.extractURLParams(history.location.pathname).personId),
	}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
