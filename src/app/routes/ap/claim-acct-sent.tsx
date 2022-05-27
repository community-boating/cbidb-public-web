import * as React from 'react';
import RouteWrapper from "core/RouteWrapper";
import PageWrapper from 'core/PageWrapper';
import ClaimAcctSent from 'containers/ap/ClaimAcctSent';
import { apPathClaimAcctSent } from 'app/paths/ap/claim-acct-sent';

export const apClaimAcctSentPageRoute = new RouteWrapper(true, apPathClaimAcctSent, history => <PageWrapper
	key="ClaimAcctSent"
	history={history}
	component={(urlProps: {}, async: any) => <ClaimAcctSent
		history={history}
	/>}
	urlProps={{}}
/>);
