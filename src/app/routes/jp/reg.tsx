import * as React from 'react';
import path from "../../paths/jp/reg";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Form as HomePageForm } from '../../../containers/HomePage';
import { apiw as welcomeAPI } from "../../../async/member-welcome";
import RegistrationWizard from '../../../containers/registration/pageflow/RegistrationWizard';
import { some } from 'fp-ts/lib/Option';

export const regPageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="reg"
    history={history}
    component={(urlProps: {personId: number}, async: HomePageForm) => <RegistrationWizard
        history={history}
        personIdStart={some(urlProps.personId)}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        includeTOS={true}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{
        personId: Number(path.extractURLParams(history.location.pathname).personId),
    }}
    shadowComponent={<span></span>}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send(null).then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



