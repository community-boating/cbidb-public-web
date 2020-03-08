import * as React from 'react';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Form as HomePageForm } from '../../../containers/HomePage';
import { apiw as welcomeAPI } from "../../../async/member-welcome";
import OffseasonClassesStandalone from '../../../containers/OffseasonClassesStandalone';
import Currency from '../../../util/Currency';

const path = parentPath.appendPathSegment<{ personId: string }>('/offseason/:personId');

export const offseasonPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="OffseasonPage"
	history={history}
	component={(urlProps: {personId: number}, async: HomePageForm) => <OffseasonClassesStandalone
		history={history}
		personId={urlProps.personId}
		currentSeason={async.season}
		offseasonPriceBase={Currency.dollars(async.jpOffseasonPriceBase)}
	/>}
	urlProps={{personId: Number(path.extractURLParams(history.location.pathname).personId)}}
	shadowComponent={<span></span>}
	getAsyncProps={() => {
		return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);