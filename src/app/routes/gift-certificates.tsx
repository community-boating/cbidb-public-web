import * as React from 'react';
import PageWrapper from "@core/PageWrapper";
import RouteWrapper from "@core/RouteWrapper";
import { setAPImage } from '@util/set-bg-image';
import JoomlaLoadingPage from '@joomla/JoomlaLoadingPage';
import GiftCertificatesWizard from '@containers/gift-certificates/GiftCertificatesWizard';
import { giftCertificatesPath } from '@paths/gift-certificates';

export const giftCertificatesPageRoute = new RouteWrapper(false, giftCertificatesPath, history => <PageWrapper
	key="giftCerts"
	history={history}
	component={(urlProps: { }) => <GiftCertificatesWizard
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
