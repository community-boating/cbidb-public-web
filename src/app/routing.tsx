import { History } from 'history';
import * as t from 'io-ts';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { apiw as welcomeAPI } from "../async/member-welcome";
import {getWrapper as getClassesWithAvail} from "../async/class-instances-with-avail"
import PageWrapper from '../core/PageWrapper';
import ReserveClasses, { bundleReservationsFromAPI, ClassInstanceObject } from '../containers/create-acct/ReserveClasses';
import HomePage, { Form as HomePageForm } from '../containers/HomePage';
import LoginPage from '../containers/LoginPage';
import Currency from '../util/Currency';
import extractURLParams from '../util/extractURLParams';
import asc from './AppStateContainer';
import { Option, none, some } from 'fp-ts/lib/Option';
import moment = require('moment');
import {getWrapper as getProtoPersonCookie} from "../async/check-proto-person-cookie"
import { getWrapper as getReservations, validator as reservationAPIValidator } from '../async/junior/get-junior-class-reservations'
import CreateAccount from '../containers/create-acct/CreateAcct';
import CheckoutWizard from '../containers/checkout/CheckoutWizard';
import {apiw as getStaticYearly} from "../async/static-yearly-data"
import MaintenanceSplash from "../containers/MaintenanceSplash"
import ReservationSignupNote from '../containers/create-acct/ReservationSignupNote';
import ThankYouPage from '../containers/checkout/ThankYou';
import ForgotPasswordPage from '../containers/ForgotPasswordPage';
import NewPasswordPage from '../containers/NewPasswordPage';
import ForgotPasswordSentPage from '../containers/ForgotPasswordSent';
import { Success } from '../core/APIWrapper';
import ratingsPageRoute from './routes/jp/ratings'
import regPageRoute from './routes/jp/reg'
import regEmptyPageRoute from './routes/jp/regEmpty'
import editPageRoute from './routes/jp/edit'
import classPageRoute from '../app/routes/jp/class'
import classTimePageRoute from '../app/routes/jp/classTime'
import signupNotePageRoute from '../app/routes/jp/signupNote'

function pathAndParamsExtractor<T extends {[K: string]: string}>(path: string) {
	return {
		path,
		getParams: extractURLParams<T>(path)
	}
}

export const paths = {
	reservationNotes: pathAndParamsExtractor<{personId: string}>("/reserve-notes/:personId"),
	resetPassword: pathAndParamsExtractor<{email: string, hash: string}>("/reset-pw/:email/:hash"),
}

export const getClassesAndPreregistrations = () => {
	return getProtoPersonCookie.send(null)
	.then(() => getReservations.send(null))
	.then(res => {
		if (res.type == "Success") {
			return Promise.resolve({
				type: "Success",
				success: res.success
			} as Success<typeof res.success>)
		} else return Promise.reject()
	})
	.then(prereg => {
		return getClassesWithAvail.send(null).then(classes => {
			return Promise.resolve({ classes, prereg })
		}, err => Promise.reject(err))
	})
	.then(({classes, prereg}) => {
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
		<Route key="/forgot-pw" path="/forgot-pw" render={() => <ForgotPasswordPage 
			history={history}
		/>} />,
		<Route key="/forgot-pw-sent" path="/forgot-pw-sent" render={() => <ForgotPasswordSentPage
			history={history}
		/>} />,
		<Route key="/reset-pw" path="/reset-pw" render={() => <PageWrapper
			key="CreateAccountPage"
			history={history}
			component={(urlProps: {email: string, hash: string}, async: any) => <NewPasswordPage
				history={history}
				email={urlProps.email}
				hash={urlProps.hash}
			/>}
			urlProps={{
				email: paths.resetPassword.getParams(history.location.pathname).email,
				hash: paths.resetPassword.getParams(history.location.pathname).hash,
			}}
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
		<Route key={`/redirect${classTimePageRoute.pathSegment.path}`} path={`/redirect${classTimePageRoute.pathSegment.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${classTimePageRoute.pathSegment.path}`).getParams(history.location.pathname);
			const path = classTimePageRoute.pathSegment.getPathFromArgs({ personId: params.personId, typeId: params.typeId });
			return <Redirect to={path} />;
		}}/>,
		<Route key={`/redirect${classPageRoute.pathSegment.path}`} path={`/redirect${classPageRoute.pathSegment.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${classPageRoute.pathSegment.path}`).getParams(history.location.pathname);
			const path = classPageRoute.pathSegment.getPathFromArgs({ personId: params.personId });
			return <Redirect to={path} />;
		}}/>,
		

		<Route key="/checkout" path="/checkout" render={() => <CheckoutWizard
			history={history}
		/>} />,

		<Route key="/thank-you" path="/thank-you" render={() => <ThankYouPage
			
		/>} />,

		ratingsPageRoute.asRoute(history),

		classPageRoute.asRoute(history),

		signupNotePageRoute.asRoute(history),

		classTimePageRoute.asRoute(history),

		regPageRoute.asRoute(history),

		editPageRoute.asRoute(history),

		regEmptyPageRoute.asRoute(history),

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

	console.log(authedDependedRoutes)

	const universalRoutes = [
		<Route key="/maintenance" path="/maintenance" render={() => <MaintenanceSplash />} />
	]

	return (
		<Router history={history}>
			<Switch>
				{...universalRoutes}
				{...authedDependedRoutes}
			</Switch>
		</Router>
	);
} 