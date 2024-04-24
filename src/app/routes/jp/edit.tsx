import * as React from 'react';
import * as t from 'io-ts';
import {jpPathEdit} from "app/paths/jp/edit";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { apiw as welcomeAPI, validator as welcomeJPValidator } from "async/member-welcome-jp";
import RegistrationWizard from 'containers/jp/jp-registration/pageflow/RegistrationWizard';
import { some } from 'fp-ts/lib/Option';
import { setJPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const editPageRoute = new RouteWrapper(true, jpPathEdit, history => <PageWrapper
    key="edit"
    history={history}
    component={(urlProps: {personId: number}, async: t.TypeOf<typeof welcomeJPValidator>) => <RegistrationWizard
        history={history}
        personIdStart={some(urlProps.personId)}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        editOnly={true}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{
        personId: Number(jpPathEdit.extractURLParams(history.location.pathname).personId),
    }}
    shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send().then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



