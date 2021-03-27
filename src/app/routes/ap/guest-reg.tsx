import * as React from 'react';
import path from "../../paths/ap/guest-reg";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setAPImage } from '../../../util/set-bg-image';
import ApPreRegister from '../../../containers/ap/ApPreRegister';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

export const apGuestRegRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="guestReg"
	history={history}
	component={() => <ApPreRegister
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
