import * as React from 'react';
import PageWrapper from "@core/PageWrapper";
import RouteWrapper from "@core/RouteWrapper";
import { setCheckoutImage } from '@util/set-bg-image';
import JoomlaLoadingPage from '@joomla/JoomlaLoadingPage';
import DonateWizard from '@containers/donate/DonateWizard';
import { donatePath } from '@paths/donate';

export const donatePageRoute = new RouteWrapper(false, donatePath, history => <PageWrapper
	key="donate"
	history={history}
	component={(urlProps: { }) => <DonateWizard
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setCheckoutImage} />}
/>);