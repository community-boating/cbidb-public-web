import * as React from 'react';
import RouteWrapper from "../../../core/RouteWrapper";
import PageWrapper from '../../../core/PageWrapper';
import DoClaimAcct from '../../../containers/ap/DoClaimAcct';
import { apPathDoClaimAcct } from '../../paths/ap/do-claim-acct';

export const apDoClaimAcctPageRoute = new RouteWrapper(true, apPathDoClaimAcct, history => <PageWrapper
	key="DoClaimAcct"
	history={history}
	component={(urlProps: {email: string, personId: number, hash: string}, async: any) => <DoClaimAcct
		history={history}
		email={urlProps.email}
		personId={urlProps.personId}
		hash={urlProps.hash}
	/>}
	urlProps={{
		email: apPathDoClaimAcct.extractURLParams(history.location.pathname).email,
		personId: Number(apPathDoClaimAcct.extractURLParams(history.location.pathname).personId),
		hash: apPathDoClaimAcct.extractURLParams(history.location.pathname).hash,
	}}
/>);
