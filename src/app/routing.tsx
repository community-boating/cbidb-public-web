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
import AccountSettingsPage from '../containers/AccountSettings';
import PaymentDetailsPage from '../containers/checkout/PaymentDetails';
import CheckoutWizard from '../containers/checkout/CheckoutWizard';
import {apiw as getWeeks, weeksValidator} from "../async/weeks"

function pathAndParamsExtractor<T extends {[K: string]: string}>(path: string) {
	return {
		path,
		getParams: extractURLParams<T>(path)
	}
}

export const paths = {
	ratings: pathAndParamsExtractor<{personId: string}>("/ratings/:personId"),
	reg: pathAndParamsExtractor<{personId: string}>("/reg/:personId"),
	class: pathAndParamsExtractor<{personId: string}>("/class/:personId"),
	classTime: pathAndParamsExtractor<{personId: string, typeId: string}>("/class-time/:personId/:typeId")
}

const getClassesAndPreregistrations = () => {
	return getProtoPersonCookie.send(null)
	.then(() => {
		return Promise.all([
			getClassesWithAvail.send(null),
			getReservations.send(null)
		])
	})
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
	console.log("inside routing function")
	console.log(asc.state)

	// TODO: auto create all these redirect routes?
	const mustNotBeLoggedIn = [
		<Route key="/precreate" path="/precreate" render={() => <Gatekeeper />} />,
		<Route key="/redirect/reserve" path="/redirect/reserve" render={() => <Redirect to="/reserve" />} />,
		<Route key="/redirect/create-acct" path="/redirect/create-acct" render={() => <Redirect to="/create-acct" />} />,
		<Route key="/reserve" path="/reserve" render={() => <PageWrapper
			key="ReserveClasses"
			component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <ReserveClasses
				history={history}
				startingPreRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
				apiResult={async.classes}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={getClassesAndPreregistrations}
		/>} />,
		<Route key="/create-acct" path="/create-acct" render={() => <PageWrapper
			key="CreateAccountPage"
			component={(urlProps: {}, async: { classes: ClassInstanceObject[], prereg: t.TypeOf<typeof reservationAPIValidator>}) => <CreateAccount
				history={history}
				preRegistrations={bundleReservationsFromAPI(async.classes)(async.prereg)}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={getClassesAndPreregistrations}
		/>} />,
		<Route key="default" render={() => <LoginPage 
			jpPrice={Currency.dollars(300)}
			lastSeason={2018}
			doLogin={asc.updateState.login.attemptLogin}
		/>} />,
	]

	const mustBeLoggedIn = [
		<Route key="login" path="/login" render={() => <Redirect to="/" />} />,
		<Route key="/redirect/checkout" path="/redirect/checkout" render={() => <Redirect to="/checkout" />} />,

		<Route key="/settings" path="/settings" render={() => <PageWrapper
			key="RatingsPage"
			component={(urlProps: {}, async: HomePageForm) => <AccountSettingsPage
				history={history}
			/>}
			urlProps={{personId: Number(paths.ratings.getParams(history.location.pathname).personId)}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={() => {
				return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="/checkout" path="/checkout" render={() => <CheckoutWizard
			history={history}
		/>} />,

		<Route key="ratings" path={paths.ratings.path} render={() => <PageWrapper
			key="RatingsPage"
			component={(urlProps: {personId: number}, async: HomePageForm) => <RatingsPage
				history={history}
				welcomePackage={async}
				personId={urlProps.personId}
			/>}
			urlProps={{personId: Number(paths.ratings.getParams(history.location.pathname).personId)}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={() => {
				return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="class" path={paths.class.path} render={() => <PageWrapper
			key="SelectClassType"
			component={(urlProps: {personId: number}, async: t.TypeOf<typeof seeTypesValidator>) => <SelectClassType
				personId={urlProps.personId}
				apiResultArray={async}
			/>}
			urlProps={{personId: Number(paths.class.getParams(history.location.pathname).personId)}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number}) => {
				return seeTypesWrapper(urlProps.personId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="classTime" path={paths.classTime.path} render={() => <PageWrapper
			key="SelectClassTime"
			component={(urlProps: {personId: number, typeId: number}, [times, weeks]: [t.TypeOf<typeof classTimesValidator>, t.TypeOf<typeof weeksValidator>]) => <SelectClassTime
				personId={urlProps.personId}
				apiResult={times}
				weeks={weeks}
			/>}
			urlProps={{
				personId: Number(paths.classTime.getParams(history.location.pathname).personId),
				typeId: Number(paths.classTime.getParams(history.location.pathname).typeId)
			}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number, typeId: number}) => {
				return Promise.all([
					classTimesWrapper(urlProps.typeId, urlProps.personId).send(null),
					getWeeks.send(null)
				]).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		// TODO: remove this duplication
		<Route key="reg" path={paths.reg.path} render={() => <PageWrapper
			key="reg"
			component={(urlProps: {personId: number}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personId={some(urlProps.personId)}
				jpPrice={async.jpPrice}
				jpOffseasonPrice={async.jpOffseasonPrice}
			/>}
			urlProps={{
				personId: Number(paths.reg.getParams(history.location.pathname).personId),
			}}
			shadowComponent={<span>hi!</span>}
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
			component={(urlProps: {}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personId={none}
				jpPrice={async.jpPrice}
				jpOffseasonPrice={async.jpOffseasonPrice}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
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
			component={(urlProps: {}, async: HomePageForm) => <HomePage
				data={async}
				history={history}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {}) => {
				return welcomeAPI.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />
	]

	const isLoggedIn = (asc.state.login.authenticatedUserName as Option<string>).isSome();

	const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

	console.log("routing function returning Router component")
	return (
		<React.Fragment>
			<Router history={history}>
				<Switch>
					{...authedDependedRoutes}
				</Switch>
			</Router>
		</React.Fragment>
	);
} 