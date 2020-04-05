import * as React from 'react';
import * as t from 'io-ts';
import path from "../../paths/ap/reg";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { validator as welcomeJPValidator } from "../../../async/member-welcome-jp";
import { some } from 'fp-ts/lib/Option';
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ApRegistrationWizard from '../../../containers/ap/ap-registration/ApRegistrationWizard';

export const apRegPageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="reg"
    history={history}
    component={(urlProps: {personId: number}, async: t.TypeOf<typeof welcomeJPValidator>) => <ApRegistrationWizard
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
    shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);



