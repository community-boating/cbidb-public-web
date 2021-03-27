import * as React from 'react';
import * as t from 'io-ts';
import {jpPathRatings} from "@paths/jp/ratings";
import PageWrapper from "@core/PageWrapper";
import RouteWrapper from "@core/RouteWrapper";
import RatingsPage from '@containers/jp/RatingsPage';
import { apiw as welcomeAPI, validator as welcomeJPValidator } from "@async/member-welcome-jp";
import { setJPImage } from '@util/set-bg-image';
import FactaLoadingPage from '@facta/FactaLoadingPage';

export const ratingsPageRoute = new RouteWrapper(true, jpPathRatings, history => <PageWrapper
	key="RatingsPage"
	history={history}
	component={(urlProps: {personId: number}, async: t.TypeOf<typeof welcomeJPValidator>) => <RatingsPage
		history={history}
		welcomePackage={async}
		personId={urlProps.personId}
	/>}
	urlProps={{personId: Number(jpPathRatings.extractURLParams(history.location.pathname).personId)}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={() => {
		return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
