import {History} from 'history';
import * as React from 'react';
import * as t from 'io-ts';
import RouteWrapper from "core/RouteWrapper";
import {jpBasePath} from "app/paths/jp/_base"
import PageWrapper from "core/PageWrapper";
import HomePageJP from "containers/jp/HomePageJP";
import { apiw as welcomeAPIJP, validator as welcomeValidatorJP } from "async/member-welcome-jp";
import { setJPImage } from 'util/set-bg-image';
import {postWrapper as getProtoPersonCookie} from "async/check-proto-person-cookie"
import { PostURLEncoded } from 'core/APIWrapperUtil';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';


export const jpHomePageRoute = new RouteWrapper(true, jpBasePath, (history: History<any>) => <PageWrapper
	key="HomePage"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof welcomeValidatorJP>) => <HomePageJP
		data={async}
		history={history}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={(urlProps: {}) => {
		return Promise.all([
			getProtoPersonCookie.send(PostURLEncoded({})),
			welcomeAPIJP.send(null)
		]).then(([whatever, welcome]) => {
			return Promise.resolve(welcome);
		}).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
