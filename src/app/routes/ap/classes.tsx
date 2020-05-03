import * as React from 'react';
import path from "../../paths/ap/classes";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApClassPage from '../../../containers/ap/ApClassPage';

export const apClassesPageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="reg"
    history={history}
    component={(urlProps: {}, async: {}) => <ApClassPage
        history={history}
    />}
    urlProps={{}}
    shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);



