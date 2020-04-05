import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/jp/edit";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { apiw as welcomeAPI, validator as welcomeJPValidator } from "../../../async/member-welcome-jp";
import RegistrationWizard from '../../../containers/jp/jp-registration/pageflow/RegistrationWizard';
import { some } from 'fp-ts/lib/Option';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import { setJPImage } from '../../../util/set-bg-image';

export const editPageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="edit"
    history={history}
    component={(urlProps: {personId: number}, async: t.TypeOf<typeof welcomeJPValidator>) => <RegistrationWizard
        history={history}
        personIdStart={some(urlProps.personId)}
        jpPrice={async.jpPrice}
        jpOffseasonPrice={async.jpOffseasonPrice}
        includeTOS={false}
        parentPersonId={async.parentPersonId}
        currentSeason={async.season}
    />}
    urlProps={{
        personId: Number(path.extractURLParams(history.location.pathname).personId),
    }}
    shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {}) => {
        return welcomeAPI.send(null).then(ret => {
            if (ret.type == "Success") {
                return Promise.resolve(ret)
            } else return Promise.reject();
        }).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



