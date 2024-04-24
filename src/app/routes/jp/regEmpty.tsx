import * as React from 'react';
import * as t from 'io-ts';
import {jpPathRegEmpty} from "app/paths/jp/regEmpty";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { apiw as welcomeAPI, validator as welcomeJPValidator } from "async/member-welcome-jp";
import RegistrationWizard from 'containers/jp/jp-registration/pageflow/RegistrationWizard';
import { none } from 'fp-ts/lib/Option';
import { setJPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const regEmptyPageRoute = new RouteWrapper(true, jpPathRegEmpty, history => <PageWrapper
    key="regEmpty"
    history={history}
    component={(urlProps: {}, async: t.TypeOf<typeof welcomeJPValidator>) => <RegistrationWizard
        history={history}
        personIdStart={none}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        editOnly={false}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{}}
    shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send().then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



