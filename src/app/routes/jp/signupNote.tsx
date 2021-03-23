import * as React from 'react';
import {jpPathSignupNote} from "../../paths/jp/signup-note";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Option } from 'fp-ts/lib/Option';
import SignupNotePage from '../../../containers/jp/class-signup/SignupNotePage';
import {getWrapper as getSignupNote} from "@async/junior/signup-note"
import { setJPImage } from '../../../util/set-bg-image';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

export const signupNotePageRoute = new RouteWrapper(true, jpPathSignupNote, history => <PageWrapper
    key="signupNote"
    history={history}
    component={(urlProps: {personId: number, instanceId: number}, async: {signupNote: Option<string>}) => <SignupNotePage
        history={history}
        personId={urlProps.personId}
        instanceId={urlProps.instanceId}
        initialNote={async.signupNote}
    />}
    urlProps={{
        personId: Number(jpPathSignupNote.extractURLParams(history.location.pathname).personId),
        instanceId: Number(jpPathSignupNote.extractURLParams(history.location.pathname).instanceId),
    }}
    shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {personId: number, instanceId: number}) => {
        return getSignupNote(urlProps.personId, urlProps.instanceId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



