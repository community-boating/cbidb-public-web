import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/jp/regEmpty";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { apiw as welcomeAPI, validator as welcomeJPValidator } from "../../../async/member-welcome-jp";
import RegistrationWizard from '../../../containers/registration/pageflow/RegistrationWizard';
import { none } from 'fp-ts/lib/Option';
import { setJPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';

export const regEmptyPageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="regEmpty"
    history={history}
    component={(urlProps: {}, async: t.TypeOf<typeof welcomeJPValidator>) => <RegistrationWizard
        history={history}
        personIdStart={none}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        includeTOS={true}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{}}
    shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send(null).then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



