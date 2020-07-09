import {History} from 'history';
import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from "../../../core/RouteWrapper";
import {apBasePath} from "../../paths/ap/_base"
import PageWrapper from '../../../core/PageWrapper';
import HomePageAP from '../../../containers/ap/HomePageAP';
import { apiw as welcomeAPIAP, validator as welcomeValidatorAP } from "../../../async/member-welcome-ap";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import {getWrapper as getProtoPersonCookie} from "../../../async/check-proto-person-cookie"

export const apHomePageRoute = new RouteWrapper(true, apBasePath, (history: History<any>) => <PageWrapper
	key="HomePage"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof welcomeValidatorAP>) => <HomePageAP
		data={async}
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
	getAsyncProps={(urlProps: {}) => {
		return Promise.all([
			getProtoPersonCookie.send(null),
			welcomeAPIAP.send(null)
		]).then(([whatever, welcome]) => {
			return Promise.resolve(welcome);
		}).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
