import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PageWrapper from '../../../core/PageWrapper';
import { apPathStartClaimAcct } from '../../paths/ap/start-claim-acct';
import StartClaimAcct from '../../../containers/ap/StartClaimAcct';

export const apStartClaimAcctPageRoute = new RouteWrapper(true, apPathStartClaimAcct, history => <PageWrapper
	key="StartClaimAcct"
	history={history}
	component={(urlProps: {}, async: any) => <StartClaimAcct
		history={history}
	/>}
	urlProps={{}}
/>);
