import * as React from 'react';
import * as t from 'io-ts';
import parentPath from './index'
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { bundleReservationsFromAPI, ClassInstanceObject } from "../../../containers/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from '../../../async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from '../../../async/util/getClassesAndPreregistrations';
import CreateAccount from '../../../containers/create-acct/CreateAcct';

const path = parentPath.appendPathSegment('/create-acct');

export const createAcctPageRoute = new RouteWrapper(true, path, history => <PageWrapper
	key="CreateAccountPage"
	history={history}
	component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <CreateAccount
		history={history}
		preRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
		noSignupJuniors={async.prereg.noSignups}
	/>}
	urlProps={{}}
	shadowComponent={<span></span>}
	getAsyncProps={getClassesAndPreregistrations}
/>);