import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/ap/edit";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { validator as welcomeJPValidator } from "../../../async/member-welcome-ap";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApRegistrationWizard from '../../../containers/ap/ap-registration/ApRegistrationWizard';

export const apEditPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="edit"
	history={history}
	component={(urlProps: { personId: number }, async: t.TypeOf<typeof welcomeJPValidator>) => <ApRegistrationWizard
		editOnly={true}
		history={history}
		currentSeason={async.season}
	/>}
	urlProps={{
		personId: Number(path.extractURLParams(history.location.pathname).personId),
	}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
