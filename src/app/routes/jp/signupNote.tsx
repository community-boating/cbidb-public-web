import * as React from 'react';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { Option } from 'fp-ts/lib/Option';
import SignupNotePage from '../../../containers/class-signup/SignupNotePage';
import {getWrapper as getSignupNote} from "../../../async/junior/signup-note"

const path = parentPath.appendPathSegment<{ personId: string, instanceId: string }>("/class-note/:personId/:instanceId");

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
    shadowComponent={<span></span>}
    getAsyncProps={(urlProps: {personId: number, instanceId: number}) => {
        return getSignupNote(urlProps.personId, urlProps.instanceId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
    }}
/>);



