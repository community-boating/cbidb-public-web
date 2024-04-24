import * as React from 'react';
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setJPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { jpPublicClassesPath } from 'app/paths/jp/jp-classes-public';
import AllClasses from 'containers/jp/AllClasses';
import {getWrapper} from "async/class-instances-with-avail"
import {apiw as getWeeks} from "async/weeks"

export const jpPublicClassesRoute = new RouteWrapper(true, jpPublicClassesPath, history => <PageWrapper
	key="AllJPClasses"
	history={history}
	component={(urlProps: {}, [classes, weeks]) => <AllClasses
	classes={classes}
		weeks={weeks}
		history={history}
	/>}
	urlProps={{ }}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={(urlProps: {}) => {
		return Promise.all([
			getWrapper.send(),
			getWeeks.send(),
		]).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);



