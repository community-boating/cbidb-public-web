import * as React from 'react';
import * as t from 'io-ts';
import path from "app/paths/ap/flag-notifications";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { setAPImage } from 'util/set-bg-image';
import FlagNotificationsPage from 'containers/ap/FlagNotificationsPage';
import { PageFlavor } from 'components/Page';
import { getWrapper as getMemberAlerts, alertEventsValidator as getValidator } from 'async/member/alerts';

export const apFlagNotificationsPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="flagNotifications"
	history={history}
	component={(urlProps: {}, initialNotificationSettings: t.TypeOf<typeof getValidator>) => <FlagNotificationsPage
		history={history}
		pageFlavor={PageFlavor.AP}
		initialNotificationSettings={initialNotificationSettings}
	/>}
	urlProps={{}}
	getAsyncProps={(urlProps: {}) => {
		return getMemberAlerts.send().catch(err => Promise.resolve(null));
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);

