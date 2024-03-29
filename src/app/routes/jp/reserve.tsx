import * as React from 'react';
import * as t from 'io-ts';
import {jpPathReserve} from "app/paths/jp/reserve";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import ReserveClasses, { bundleReservationsFromAPI, ClassInstanceObject } from "containers/jp/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from 'async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from 'async/util/getClassesAndPreregistrations';
import { setJPImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';

export const reservePageRoute = new RouteWrapper(true, jpPathReserve, history => <PageWrapper
    key="ReserveClasses"
    history={history}
    component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReserveClasses
        history={history}
        startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
        noSignupJuniors={async.prereg.noSignups}
        apiResultStart={async.classes}
    />}
    urlProps={{}}
    shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
    getAsyncProps={getClassesAndPreregistrations}
/>);
