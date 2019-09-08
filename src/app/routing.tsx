import { History } from 'history';
import * as t from 'io-ts';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';

import { getWrapper as classTimesWrapper, validator as classTimesValidator } from "../async/junior/get-class-instances";
import { getWrapper as seeTypesWrapper, validator as seeTypesValidator } from "../async/junior/see-types";
import { apiw as welcomeAPI } from "../async/member-welcome";
import {getWrapper as getClassesWithAvail, validator as getClassesWithAvailValidator} from "../async/class-instances-with-avail"
import PageWrapper from '../core/PageWrapper';
import SelectClassTime from "../containers/class-signup/SelectClassTime";
import SelectClassType from "../containers/class-signup/SelectClassType";
import CreateAccount from '../containers/create-acct/CreateAccount';
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

// TODO: real shadow components on everything
export default function (history: History<any>) {
	console.log("inside routing function")
	console.log(asc.state)

	const mustNotBeLoggedIn = [
		<Route key="/precreate" path="/precreate" render={() => <Gatekeeper />} />,
		<Route key="/create-acct" path="/create-acct" render={() => <PageWrapper
			key="CreateAccountPage"
			component={(urlProps: {}, async: t.TypeOf<typeof getClassesWithAvailValidator>) => <CreateAccount
				preRegistrations={[{
					firstName: "Timmy",
					beginner: some({
						instanceId: 123,
						dateRange: "06/24 - 06/28",
						timeRange: "09:00 - 12:00"
					}),
					intermediate: none
				}]}
				apiResult={async.map(row => {
					const startDateMoment = moment(row.startDatetimeRaw, "MM/DD/YYYY HH:mm")
					return {
						...row,
						startDateMoment,
						endDateMoment: moment(row.endDatetimeRaw, "MM/DD/YYYY HH:mm"),
						isMorning: Number(startDateMoment.format("HH")) < 12
					};
				})}
			/>}
			urlProps={{}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={() => {
				return getClassesWithAvail.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,
		<Route key="default" render={() => <LoginPage 
			jpPrice={Currency.dollars(300)}
			lastSeason={2018}
			doLogin={asc.updateState.login.attemptLogin}

		/>} />,
	]

	const mustBeLoggedIn = [
		<Route key="login" path="/login" render={() => <Redirect to="/" />} />,

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
			component={(urlProps: {personId: number, typeId: number}, async: t.TypeOf<typeof classTimesValidator>) => <SelectClassTime
				personId={urlProps.personId}
				apiResult={async}
			/>}
			urlProps={{
				personId: Number(paths.classTime.getParams(history.location.pathname).personId),
				typeId: Number(paths.classTime.getParams(history.location.pathname).typeId)
			}}
			shadowComponent={<span>hi!</span>}
			getAsyncProps={(urlProps: {personId: number, typeId: number}) => {
				return classTimesWrapper(urlProps.typeId, urlProps.personId).send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
			}}
		/>} />,

		<Route key="reg" exact path={paths.reg.path} render={() => <PageWrapper
			key="HomePage"
			component={(urlProps: {personId: number}, async: HomePageForm) => <RegistrationWizard
				history={history}
				personId={urlProps.personId}
				hasEIIResponse={async.hasEIIResponse}
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

		<Route key="default" render={() => <PageWrapper
			key="HomePage"
			component={(urlProps: {}, async: HomePageForm) => <HomePage
				data={async}
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