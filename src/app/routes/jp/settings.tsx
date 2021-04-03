import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PageWrapper from '../../../core/PageWrapper';
import { jpSettingsPagePath } from '../../paths/jp/settings';
import SettingsPage from '../../../containers/SettingsPage';
import { PageFlavor } from '../../../components/Page';

export const jpSettingsPageRoute = new RouteWrapper(true, jpSettingsPagePath, history => <PageWrapper
	key="JPSettingsPage"
	history={history}
	component={(urlProps: {}, async: any) => <SettingsPage
		history={history}
		pageFlavor={PageFlavor.JP}
	/>}
	urlProps={{}}
/>);
