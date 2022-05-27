import * as React from 'react';
import path	from "app/paths/ap/guest-reg";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import ApGuestRegister, { NONMEM_REG_FLOW } from 'containers/ap/NonmemberRegistration';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const apGuestRegRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="guestReg"
	history={history}
	component={() => <ApGuestRegister
		history={history}
		rentalMode={NONMEM_REG_FLOW.GUEST}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
