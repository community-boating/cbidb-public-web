import * as React from 'react';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Form as HomePageForm } from '../../../containers/HomePage';
import { apiw as welcomeAPI } from "../../../async/member-welcome";
import RegistrationWizard from '../../../containers/registration/pageflow/RegistrationWizard';
import { none } from 'fp-ts/lib/Option';

const path = parentPath.appendPathSegment<{ personId: string }>("/reg");

export default new RouteWrapper(true, path, history => <PageWrapper
    key="regEmpty"
    history={history}
    component={(urlProps: {}, async: HomePageForm) => <RegistrationWizard
        history={history}
        personIdStart={none}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        includeTOS={true}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{}}
    shadowComponent={<span></span>}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send(null).then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



