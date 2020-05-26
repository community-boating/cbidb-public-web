import * as React from 'react';
import path from "../../paths/ap/prereg";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApPreRegister from '../../../containers/ap/ApPreRegister';

export const apPreRegRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="prereg"
	history={history}
	component={() => <ApPreRegister
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);