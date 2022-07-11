import * as React from 'react';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import GiftCertificatesWizard from 'containers/gift-certificates/GiftCertificatesWizard';
import { giftCertificatesPath } from 'app/paths/gift-certificates';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const giftCertificatesPageRoute = new RouteWrapper(false, giftCertificatesPath, history => <PageWrapper
	key="giftCerts"
	history={history}
	component={(urlProps: { }) => <GiftCertificatesWizard
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
