import * as React from 'react';
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import jpPath from "../../paths/jp/_base"
import LoginPage from '../../../containers/LoginPage';
import asc from '../../AppStateContainer';
import {apiw as getStaticYearly} from "../../../async/static-yearly-data"
import { none, some } from 'fp-ts/lib/Option';
import Currency from '../../../util/Currency';

export const jpLoginPageRoute = new RouteWrapper(true, jpPath, history => <PageWrapper
	key="Loginpage"
	history={history}
	component={(urlProps: {}, async: any) => <LoginPage
		history={history}
		jpPrice={async[0]}
		lastSeason={async[1]}
		doLogin={asc.updateState.login.attemptLogin}
	/>}
	urlProps={{}}
	shadowComponent={<span></span>}
	getAsyncProps={(urlProps: {}) => {
		return getStaticYearly.send(null).then(res => {
			if (res.type == "Failure") {
				return Promise.resolve({type: "Success", success: [none, none]})
			} else {
				return Promise.resolve({type: "Success", success: [some(Currency.dollars(res.success.data.rows[0][0])), some(res.success.data.rows[0][1]-1)]})
			}
		});  // TODO: handle failure
	}}
/>);
