import * as React from 'react';
import * as t from 'io-ts';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { bundleReservationsFromAPI, ClassInstanceObject } from "../../../containers/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from '../../../async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from '../../../async/util/getClassesAndPreregistrations';
import ReservationSignupNote from '../../../containers/create-acct/ReservationSignupNote';

const path = parentPath.appendPathSegment<{ personId: string }>('/reserve-notes/:personId');

export const reserveNotesPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="reservationNotes"
	history={history}
	component={(urlProps: {personId: number}, async:{ classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReservationSignupNote
		history={history}
		personId={urlProps.personId}
		startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
	/>}
	urlProps={{
		personId: Number(path.extractURLParams(history.location.pathname).personId),
	}}
	shadowComponent={<span></span>}
	getAsyncProps={getClassesAndPreregistrations}
/>);