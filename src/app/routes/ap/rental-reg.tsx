import * as React from 'react';
import {apRentalPath}	from "app/paths/ap/rental-reg";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import ApGuestRegister, { NONMEM_REG_FLOW } from 'containers/ap/NonmemberRegistration';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const apRentalRegRoute = new RouteWrapper(true, apRentalPath, history => <PageWrapper
	key="rentalReg"
	history={history}
	component={() => <ApGuestRegister
		history={history}
		rentalMode={NONMEM_REG_FLOW.RENTAL}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
