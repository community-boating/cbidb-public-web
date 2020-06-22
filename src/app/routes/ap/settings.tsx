import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PageWrapper from '../../../core/PageWrapper';
import { apSettingsPagePath } from '../../paths/ap/settings';
import ApSettingsPage from '../../../containers/ap/ApSettingsPage';

export const apSettingsPageRoute = new RouteWrapper(true, apSettingsPagePath, history => <PageWrapper
	key="StartClaimAcct"
	history={history}
	component={(urlProps: {}, async: any) => <ApSettingsPage
		history={history}
	/>}
	urlProps={{}}
/>);
