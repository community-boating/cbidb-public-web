import { History } from 'history';
import * as t from 'io-ts';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';

import { getWrapper as classTimesWrapper, getClassInstancesValidator as classTimesValidator } from "../async/junior/get-class-instances";
import { getWrapper as seeTypesWrapper, validator as seeTypesValidator } from "../async/junior/see-types";
import { apiw as welcomeAPI } from "../async/member-welcome";
import {getWrapper as getClassesWithAvail, validator as getClassesWithAvailValidator} from "../async/class-instances-with-avail"
import PageWrapper from '../core/PageWrapper';
import SelectClassTime from "../containers/class-signup/SelectClassTime";
import SelectClassType from "../containers/class-signup/SelectClassType";
import ReserveClasses, { bundleReservationsFromAPI, ClassInstanceObject } from '../containers/create-acct/ReserveClasses';
import Gatekeeper from "../containers/create-acct/Gatekeeper";
import HomePage, { Form as HomePageForm } from '../containers/HomePage';
import LoginPage from '../containers/LoginPage';
import RatingsPage from '../containers/RatingsPage';
import RegistrationWizard from '../containers/registration/pageflow/RegistrationWizard';
import Currency from '../util/Currency';
import extractURLParams from '../util/extractURLParams';
import asc from './AppStateContainer';
import { Option, none, some, Some } from 'fp-ts/lib/Option';
import moment = require('moment');
import {getWrapper as getProtoPersonCookie} from "../async/check-proto-person-cookie"
import { getWrapper as getReservations, validator as reservationAPIValidator } from '../async/junior/get-junior-class-reservations'
import CreateAccount from '../containers/create-acct/CreateAcct';
import ScholarshipResultsPage from '../containers/ScholarshipResults';
import RequiredInfo from '../containers/registration/RequiredInfo';
import { defaultValue as requiredDefaultForm } from '../async/junior/required'
import  {getWrapper as getSignups, GetSignupsAPIResult } from "../async/junior/get-signups"
import AccountSettingsPage from '../containers/AccountSettings';
import PaymentDetailsPage from '../containers/checkout/PaymentDetails';
import CheckoutWizard from '../containers/checkout/CheckoutWizard';
import {apiw as getWeeks, weeksValidator} from "../async/weeks"
import {apiw as getStaticYearly} from "../async/static-yearly-data"
import SignupNotePage from '../containers/class-signup/SignupNotePage';
import {getWrapper as getSignupNote} from "../async/junior/signup-note"
import MaintenanceSplash from "../containers/MaintenanceSplash"
import ReservationSignupNote from '../containers/create-acct/ReservationSignupNote';
import ThankYouPage from '../containers/checkout/ThankYou';


function pathAndParamsExtractor<T extends {[K: string]: string}>(path: string) {
	return {
		path,
		getParams: extractURLParams<T>(path)
	}
}

export const paths = {
	ratings: pathAndParamsExtractor<{personId: string}>("/ratings/:personId"),
	reg: pathAndParamsExtractor<{personId: string}>("/reg/:personId"),
	edit: pathAndParamsExtractor<{personId: string}>("/edit/:personId"),
	class: pathAndParamsExtractor<{personId: string}>("/class/:personId"),
	classTime: pathAndParamsExtractor<{personId: string, typeId: string}>("/class-time/:personId/:typeId"),
	signupNote: pathAndParamsExtractor<{personId: string, instanceId: string}>("/class-note/:personId/:instanceId"),
	reservationNotes: pathAndParamsExtractor<{personId: string}>("/reserve-notes/:personId"),
}

export const getClassesAndPreregistrations = () => {
	return getProtoPersonCookie.send(null)
	.then(() => getReservations.send(null))
	.then(res => {
		if (res.type == "Success") {
			return Promise.resolve({
				type: "Success",
				success: res.success
			})
		} else return Promise.reject()
	})
	.then(prereg => new Promise((resolve, reject) => {
		getClassesWithAvail.send(null).then(classes => {
			resolve([classes, prereg])
		}, err => reject(err))
	}))
	.then(([classes, prereg]) => {
		if (classes.type == "Success" && prereg.type == "Success") {
			return Promise.resolve({type: "Success", success: {
				prereg: prereg.success,
				classes: classes.success.map(row => {
					const startDateMoment = moment(row.startDatetimeRaw, "MM/DD/YYYY HH:mm")
					return {
						...row,
						startDateMoment,
						endDateMoment: moment(row.endDatetimeRaw, "MM/DD/YYYY HH:mm"),
						isMorning: Number(startDateMoment.format("HH")) < 12
					};
				})
			}})
		} else return Promise.reject();
		
	})
	.catch(err => Promise.resolve(null));  // TODO: handle failure
}

// TODO: real shadow components on everything
export default function (history: History<any>) {
	// TODO: auto create all these redirect routes?
	const mustNotBeLoggedIn = [
		<Route key="/precreate" path="/precreate" render={() => <Gatekeeper />} />,
		<Route key="/redirect/reserve" path="/redirect/reserve" render={() => <Redirect to="/reserve" />} />,
		<Route key="/redirect/create-acct" path="/redirect/create-acct" render={() => <Redirect to="/create-acct" />} />,
		<Route key="/reserve" path="/reserve" render={() => <PageWrapper
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
		/>} />,
		<Route key={paths.reservationNotes.path} path={paths.reservationNotes.path} render={() => <PageWrapper
			key="reservationNotes"
			history={history}
			component={(urlProps: {personId: number}, async:{ classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReservationSignupNote
				history={history}
				personId={urlProps.personId}
				startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
			/>}
			urlProps={{
				personId: Number(paths.reservationNotes.getParams(history.location.pathname).personId),
			}}
			shadowComponent={<span></span>}
			getAsyncProps={getClassesAndPreregistrations}
		/>} />,
		<Route key="/create-acct" path="/create-acct" render={() => <PageWrapper
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
		/>} />,
		<Route key="default" render={() => <PageWrapper
			key="CreateAccountPage"
			history={history}
			component={(urlProps: {}, async: any) => <LoginPage 
				history={history}
				jpPrice={async[0]}
				lastSeason={async[1]}
				doLogin={asc.updateState.login.attemptLogin}
			/>}
			urlProps={{}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {}) => {
				return getStaticYearly.send(null).then(res => {
					if (res.type == "Failure") {
						return Promise.resolve({type: "Success", success: [none, none]})
					} else {
						return Promise.resolve({type: "Success", success: [some(Currency.dollars(res.success.data.rows[0][0])), some(res.success.data.rows[0][1]-1)]})
					}
				});  // TODO: handle failure
			}}
		/>} />,
	]

	const mustBeLoggedIn = [
		<Route key="login" path="/login" render={() => <Redirect to="/" />} />,
		<Route key="home" path="/redirect/home" render={() => <Redirect to="/" />} />,
		<Route key="/redirect/checkout" path="/redirect/checkout" render={() => <Redirect to="/checkout" />} />,
		<Route key={`/redirect${paths.classTime.path}`} path={`/redirect${paths.classTime.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${paths.classTime.path}`).getParams(history.location.pathname);
			const path = paths.classTime.path.replace(":personId", params.personId).replace(":typeId", params.typeId);
			return <Redirect to={path} />;
		}}/>,
		<Route key={`/redirect${paths.class.path}`} path={`/redirect${paths.class.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${paths.class.path}`).getParams(history.location.pathname);
			const path = paths.class.path.replace(":personId", params.personId);
			return <Redirect to={path} />;
		}}/>,

		<Route key="/settings" path="/settings" render={() => <PageWrapper
			key="RatingsPage"
			history={history}
			component={(urlProps: {}, async: HomePageForm) => <AccountSettingsPage
				history={history}
			/>}
			urlProps={{personId: Number(paths.ratings.getParams(history.location.pathname).personId)}}
			shadowComponent={<span></span>}
			getAsyncProps={() => {
				return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="/checkout" path="/checkout" render={() => <CheckoutWizard
			history={history}
		/>} />,

		<Route key="/thank-you" path="/thank-you" render={() => <ThankYouPage
			
		/>} />,

		<Route key="ratings" path={paths.ratings.path} render={() => <PageWrapper
			key="RatingsPage"
			history={history}
			component={(urlProps: {personId: number}, async: HomePageForm) => <RatingsPage
				history={history}
				welcomePackage={async}
				personId={urlProps.personId}
			/>}
			urlProps={{personId: Number(paths.ratings.getParams(history.location.pathname).personId)}}
			shadowComponent={<span></span>}
			getAsyncProps={() => {
				return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="class" path={paths.class.path} render={() => <PageWrapper
			key="SelectClassType"
			history={history}
			component={(urlProps: {personId: number}, [apiResult, signups]: [t.TypeOf<typeof seeTypesValidator>, GetSignupsAPIResult]) => <SelectClassType
				personId={urlProps.personId}
				apiResultArray={apiResult}
				history={history}
				signups={signups}
			/>}
			urlProps={{personId: Number(paths.class.getParams(history.location.pathname).personId)}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {personId: number}) => {
				return Promise.all([
					seeTypesWrapper(urlProps.personId).send(null),
					getSignups(urlProps.personId).send(null)
				]).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="signupNote" path={paths.signupNote.path} render={() => <PageWrapper
			key="signupNote"
			history={history}
			component={(urlProps: {personId: number, instanceId: number}, async: {signupNote: Option<string>}) => <SignupNotePage
				history={history}
				personId={urlProps.personId}
				instanceId={urlProps.instanceId}
				initialNote={async.signupNote}
			/>}
			urlProps={{
				personId: Number(paths.signupNote.getParams(history.location.pathname).personId),
				instanceId: Number(paths.signupNote.getParams(history.location.pathname).instanceId),
			}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {personId: number, instanceId: number}) => {
				return getSignupNote(urlProps.personId, urlProps.instanceId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="classTime" path={paths.classTime.path} render={() => <PageWrapper
			key="SelectClassTime"
			history={history}
			component={(
				urlProps: {personId: number, typeId: number},
				[times, weeks, signups]: [t.TypeOf<typeof classTimesValidator>, t.TypeOf<typeof weeksValidator>, GetSignupsAPIResult]
			) => <SelectClassTime
				typeId={urlProps.typeId}
				personId={urlProps.personId}
				apiResult={times}
				weeks={weeks}
				history={history}
				signups={signups}
			/>}
			urlProps={{
				personId: Number(paths.classTime.getParams(history.location.pathname).personId),
				typeId: Number(paths.classTime.getParams(history.location.pathname).typeId)
			}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {personId: number, typeId: number}) => {
				return Promise.all([
					classTimesWrapper(urlProps.typeId, urlProps.personId).send(null),
					getWeeks.send(null),
					getSignups(urlProps.personId).send(null)
				]).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		// TODO: remove this duplication
		<Route key="reg" path={paths.reg.path} render={() => <PageWrapper
			key="reg"
			history={history}
			component={(urlProps: {personId: number}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personIdStart={some(urlProps.personId)}
				jpPrice={async.jpPrice}
				jpOffseasonPrice={async.jpOffseasonPrice}
				includeTOS={true}
				parentPersonId={async.parentPersonId}
				currentSeason={async.season}
			/>}
			urlProps={{
				personId: Number(paths.reg.getParams(history.location.pathname).personId),
			}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {}) => {
				return welcomeAPI.send(null).then(ret => {
					if (ret.type == "Success") {
						return Promise.resolve(ret)
					} else return Promise.reject();
				}).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="edit" path={paths.edit.path} render={() => <PageWrapper
			key="edit"
			history={history}
			component={(urlProps: {personId: number}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personIdStart={some(urlProps.personId)}
				jpPrice={async.jpPrice}
				jpOffseasonPrice={async.jpOffseasonPrice}
				includeTOS={false}
				parentPersonId={async.parentPersonId}
				currentSeason={async.season}
			/>}
			urlProps={{
				personId: Number(paths.edit.getParams(history.location.pathname).personId),
			}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {}) => {
				return welcomeAPI.send(null).then(ret => {
					if (ret.type == "Success") {
						return Promise.resolve(ret)
					} else return Promise.reject();
				}).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="regEmpty" path={"/reg"} render={() => <PageWrapper
			key="regEmpty"
			history={history}
			component={(urlProps: {}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personIdStart={none}
				jpPrice={async.jpPrice}
				jpOffseasonPrice={async.jpOffseasonPrice}
				includeTOS={true}
				parentPersonId={async.parentPersonId}
				currentSeason={async.season}
			/>}
			urlProps={{}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {}) => {
				return welcomeAPI.send(null).then(ret => {
					if (ret.type == "Success") {
						return Promise.resolve(ret)
					} else return Promise.reject();
				}).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="default" render={() => <PageWrapper
			key="HomePage"
			history={history}
			component={(urlProps: {}, async: HomePageForm) => <HomePage
				data={async}
				history={history}
			/>}
			urlProps={{}}
			shadowComponent={<span></span>}
			getAsyncProps={(urlProps: {}) => {
				return Promise.all([
					getProtoPersonCookie.send(null),
					welcomeAPI.send(null)
				]).then(([whatever, welcome]) => {
					return Promise.resolve(welcome);
				}).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />
	]

	const isLoggedIn = (asc.state.login.authenticatedUserName as Option<string>).isSome();

	const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

	const universalRoutes = [
		<Route key="/maintenance" path="/maintenance" render={() => <MaintenanceSplash />} />
	]

	return (
		<React.Fragment>
			<Router history={history}>
				<Switch>
					{...universalRoutes}
					{...authedDependedRoutes}
				</Switch>
			</Router>
		</React.Fragment>
	);
} 