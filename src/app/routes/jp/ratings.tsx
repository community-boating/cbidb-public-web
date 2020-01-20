import * as React from 'react';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import RatingsPage from '../../../containers/RatingsPage';
import { Form as HomePageForm } from '../../../containers/HomePage';
import { apiw as welcomeAPI } from "../../../async/member-welcome";

const path = parentPath.appendPathSegment<{ personId: string }>('/ratings/:personId');

export default new RouteWrapper(true, path, history => <PageWrapper
	key="RatingsPage"
	history={history}
	component={(urlProps: {personId: number}, async: HomePageForm) => <RatingsPage
		history={history}
		welcomePackage={async}
		personId={urlProps.personId}
	/>}
	urlProps={{personId: Number(path.extractURLParams(history.location.pathname).personId)}}
	shadowComponent={<span></span>}
	getAsyncProps={() => {
		return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);