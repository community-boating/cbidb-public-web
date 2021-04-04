import * as React from 'react';
import {apPathResetPW} from "@paths/ap/reset-pw";
import RouteWrapper from "@core/RouteWrapper";
import NewPasswordPage from '@containers/NewPasswordPage';
import PageWrapper from '@core/PageWrapper';
import { PageFlavor } from '@components/Page';

export const apResetPasswordPageRoute = new RouteWrapper(true, apPathResetPW, history => <PageWrapper
	key="ResetPwPage"
	history={history}
	component={(urlProps: {email: string, hash: string}, async: any) => <NewPasswordPage
		history={history}
		program={PageFlavor.AP}
		email={urlProps.email}
		hash={urlProps.hash}
	/>}
	urlProps={{
		email: apPathResetPW.extractURLParams(history.location.pathname).email,
		hash: apPathResetPW.extractURLParams(history.location.pathname).hash,
	}}
/>);
