import * as React from 'react';
import path from "../../paths/ap/create-acct";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApCreateAcct from '../../../containers/ap/ApCreateAcct';

export const apCreateAcctRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="create-acct"
	history={history}
	component={() => <ApCreateAcct
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
