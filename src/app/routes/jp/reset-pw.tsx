import * as React from 'react';
import parentPath from './index'
import RouteWrapper from "../../../core/RouteWrapper";
import NewPasswordPage from '../../../containers/NewPasswordPage';
import PageWrapper from '../../../core/PageWrapper';

const path = parentPath.appendPathSegment<{email: string, hash: string}>("/reset-pw/:email/:hash");

export const resetPasswordPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="ResetPwPage"
	history={history}
	component={(urlProps: {email: string, hash: string}, async: any) => <NewPasswordPage
		history={history}
		email={urlProps.email}
		hash={urlProps.hash}
	/>}
	urlProps={{
		email: path.extractURLParams(history.location.pathname).email,
		hash: path.extractURLParams(history.location.pathname).hash,
	}}
/>);
