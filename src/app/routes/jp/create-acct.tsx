import * as React from 'react';
import * as t from 'io-ts';
import {jpPathCreateAcct} from "../../paths/jp/create-acct";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { bundleReservationsFromAPI, ClassInstanceObject } from "../../../containers/jp/create-acct/ReserveClasses"
import { validator as reservationAPIValidator } from '../../../async/junior/get-junior-class-reservations'
import getClassesAndPreregistrations from '../../../async/util/getClassesAndPreregistrations';
import CreateAccount from '../../../containers/jp/create-acct/CreateAcct';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import { setJPImage } from '../../../util/set-bg-image';

export const createAcctPageRoute = new RouteWrapper(true, jpPathCreateAcct, history => <PageWrapper
	key="CreateAccountPage"
	history={history}
	component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <CreateAccount
		history={history}
		preRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
		noSignupJuniors={async.prereg.noSignups}
	/>}
	urlProps={{}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
	getAsyncProps={getClassesAndPreregistrations}
/>);