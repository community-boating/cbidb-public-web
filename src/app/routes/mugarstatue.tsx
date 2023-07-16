import * as React from 'react';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setCheckoutImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import MugarDonateWizard from 'containers/donate-mugar/MugarDonateWizard';
import { mugarDonatePath } from 'app/paths/mugarstatue';

export const mugarDonatePageRoute = new RouteWrapper(false, mugarDonatePath, history => <PageWrapper
	key="mugardonate"
	history={history}
	component={() => <MugarDonateWizard
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
/>);