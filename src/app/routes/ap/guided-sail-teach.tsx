import * as React from 'react';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { apPathGuidedSailTeach } from 'app/paths/ap/guided-sail-teach';
import { GuidedSailTeachPage } from 'containers/ap/GuidedSailTeachPage';

export const apGuidedSailTeachRoute = new RouteWrapper(true, apPathGuidedSailTeach, history => <PageWrapper
	key="guided-sail-teach"
	history={history}
	component={(urlProps: {}, async: {}) => <GuidedSailTeachPage

	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);




