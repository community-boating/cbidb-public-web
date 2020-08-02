import * as React from 'react';
import * as t from 'io-ts';
import {jpPathReserveNotes} from "../../paths/jp/reserve-notes";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { bundleReservationsFromAPI, ClassInstanceObject } from "../../../containers/jp/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from '../../../async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from '../../../async/util/getClassesAndPreregistrations';
import ReservationSignupNote from '../../../containers/jp/create-acct/ReservationSignupNote';
import { setJPImage } from '../../../util/set-bg-image';
import FactaLoadingPage from '../../../theme/facta/FactaLoadingPage';

export const reserveNotesPageRoute = new RouteWrapper(true, jpPathReserveNotes, history => <PageWrapper
	key="reservationNotes"
	history={history}
	component={(urlProps: {personId: number}, async:{ classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReservationSignupNote
		history={history}
		personId={urlProps.personId}
		startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
	/>}
	urlProps={{
		personId: Number(jpPathReserveNotes.extractURLParams(history.location.pathname).personId),
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={getClassesAndPreregistrations}
/>);
