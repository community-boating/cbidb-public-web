import * as React from 'react';
import * as t from 'io-ts';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import ReserveClasses, { bundleReservationsFromAPI, ClassInstanceObject } from "../../../containers/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from '../../../async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from '../../../async/util/getClassesAndPreregistrations';

const path = parentPath.appendPathSegment('/reserve');

export default new RouteWrapper(true, path, history => <PageWrapper
    key="ReserveClasses"
    history={history}
    component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReserveClasses
        history={history}
        startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
        noSignupJuniors={async.prereg.noSignups}
        apiResultStart={async.classes}
    />}
    urlProps={{}}
    shadowComponent={<span></span>}
    getAsyncProps={getClassesAndPreregistrations}
/>);