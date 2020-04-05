import * as React from 'react';
import path from "../../paths/jp/signup-note";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Option } from 'fp-ts/lib/Option';
import SignupNotePage from '../../../containers/jp/class-signup/SignupNotePage';
import {getWrapper as getSignupNote} from "../../../async/junior/signup-note"
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import { setJPImage } from '../../../util/set-bg-image';

export const signupNotePageRoute = new RouteWrapper(true, path, history => <PageWrapper
    key="signupNote"
    history={history}
    component={(urlProps: {personId: number, instanceId: number}, async: {signupNote: Option<string>}) => <SignupNotePage
        history={history}
        personId={urlProps.personId}
        instanceId={urlProps.instanceId}
        initialNote={async.signupNote}
    />}
    urlProps={{
        personId: Number(path.extractURLParams(history.location.pathname).personId),
        instanceId: Number(path.extractURLParams(history.location.pathname).instanceId),
    }}
    shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={(urlProps: {personId: number, instanceId: number}) => {
        return getSignupNote(urlProps.personId, urlProps.instanceId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);


