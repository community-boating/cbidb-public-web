import * as React from 'react';
import {jpPathResetPW} from "../../paths/jp/reset-pw";
import RouteWrapper from "../../../core/RouteWrapper";
import NewPasswordPage from '../../../containers/NewPasswordPage';
import PageWrapper from '../../../core/PageWrapper';

export const resetPasswordPageRoute = new RouteWrapper(true, jpPathResetPW, history => <PageWrapper
	key="ResetPwPage"
	history={history}
	component={(urlProps: {email: string, hash: string}, async: any) => <NewPasswordPage
		history={history}
		email={urlProps.email}
		hash={urlProps.hash}
	/>}
	urlProps={{
		email: jpPathResetPW.extractURLParams(history.location.pathname).email,
		hash: jpPathResetPW.extractURLParams(history.location.pathname).hash,
	}}
/>);
