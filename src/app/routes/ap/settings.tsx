import * as React from 'react';
import RouteWrapper from "@core/RouteWrapper";
import PageWrapper from '@core/PageWrapper';
import { apSettingsPagePath } from '@paths/ap/settings';
import SettingsPage from '@containers/SettingsPage';
import { PageFlavor } from '@components/Page';

export const apSettingsPageRoute = new RouteWrapper(true, apSettingsPagePath, history => <PageWrapper
	key="APSettingsPage"
	history={history}
	component={(urlProps: {}, async: any) => <SettingsPage
		history={history}
		pageFlavor={PageFlavor.AP}
	/>}
	urlProps={{}}
/>);
