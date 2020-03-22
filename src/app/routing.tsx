import * as Sentry from '@sentry/browser';
import { History } from 'history';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { apiw as welcomeAPI } from "../async/member-welcome";
import PageWrapper from '../core/PageWrapper';
import HomePage, { Form as HomePageForm } from '../containers/HomePage';
import asc from './AppStateContainer';
import { Option } from 'fp-ts/lib/Option';
import {getWrapper as getProtoPersonCookie} from "../async/check-proto-person-cookie"
import {ratingsPageRoute} from './routes/jp/ratings'
import {regPageRoute} from './routes/jp/reg'
import {regEmptyPageRoute} from './routes/jp/regEmpty'
import {editPageRoute} from './routes/jp/edit'
import {classPageRoute} from './routes/jp/class'
import {classTimePageRoute} from './routes/jp/classTime'
import {signupNotePageRoute} from './routes/jp/signupNote'
import {reservePageRoute} from './routes/jp/reserve'
import {reserveNotesPageRoute} from './routes/jp/reserve-notes'
import {checkoutPageRoute} from "./routes/common/checkout"
import {thankyouPageRoute} from "./routes/common/thank-you"
import { maintenancePageRoute } from './routes/common/maintenance';
import { createAcctPageRoute } from './routes/jp/create-acct';
import { forgotPasswordPageRoute } from './routes/jp/forgot-pw';
import { forgotPasswordSentPageRoute } from './routes/jp/forgot-pw-sent';
import { resetPasswordPageRoute } from './routes/jp/reset-pw';
import { jpLoginPageRoute } from './routes/jp/_base';
import PathWrapper from '../core/PathWrapper';
import { offseasonPageRoute } from './routes/jp/offseason'

const defaultRouteRender = () => {
	console.log("uncaught path...", window.location.pathname)
	const redirectRegex = /^\/redirect\/(.*)$/;
	const redirectRegexMatchResult = redirectRegex.exec(window.location.pathname);
	if (redirectRegexMatchResult) {
		// First see if its a redirect
		console.log("... its a redirect, going to " + redirectRegexMatchResult[1]);
		return <Redirect to={'/' + redirectRegexMatchResult[1]} />;
	} else {
		console.log("its not a redirect....")
		const jpRegex = /^\/jp\/(.*)$/;
		const jpRegexMatchResult = jpRegex.exec(window.location.pathname);
		if (jpRegexMatchResult) {
			console.log("it does have a jp in front and its still nothing.  GIve up")
			return <Redirect to="/" />;
		} else {
			console.log("... its doesnt have a jp in front, lets try adding one")
			Sentry.captureMessage("Uncaught route " + window.location.pathname)
			return <Redirect to={'/jp/' + PathWrapper.removeLeadingTrailingSlashes(window.location.pathname)} />;
		}
	}
};

// TODO: real shadow components on everything
export default function (history: History<any>) {
	const mustNotBeLoggedIn = [	
		reservePageRoute.asRoute(history),

		reserveNotesPageRoute.asRoute(history),

		createAcctPageRoute.asRoute(history),

		forgotPasswordPageRoute.asRoute(history),

		forgotPasswordSentPageRoute.asRoute(history),

		resetPasswordPageRoute.asRoute(history),

		jpLoginPageRoute.asRoute(history),

		// TODO: eventually there should be a combined landing page or something
		<Route key="loginRedirect" path="/" render={() => <Redirect to="/jp" />} />,

		<Route key="defaultPub" render={defaultRouteRender} />,
	]

	const mustBeLoggedIn = [
		<Route key="login" path="/login" render={() => <Redirect to="/" />} />,
		
		checkoutPageRoute.asRoute(history),

		thankyouPageRoute.asRoute(history),

		ratingsPageRoute.asRoute(history),

		classPageRoute.asRoute(history),

		signupNotePageRoute.asRoute(history),

		classTimePageRoute.asRoute(history),

		regPageRoute.asRoute(history),

		editPageRoute.asRoute(history),

		regEmptyPageRoute.asRoute(history),

		offseasonPageRoute.asRoute(history),

		<Route key="homeExplicit" path="/home" render={() => <Redirect to="/" />} />,

		<Route key="home" path="/" exact render={() => <PageWrapper
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
		/>} />,

		<Route key="defaultAuth" render={defaultRouteRender} />,
	]

	const isLoggedIn = (asc.state.login.authenticatedUserName as Option<string>).isSome();

	const authedDependedRoutes = isLoggedIn ? mustBeLoggedIn : mustNotBeLoggedIn

	const universalRoutes = [
		maintenancePageRoute.asRoute(history)
	];

	// check on boot for duplicate route keys
	universalRoutes.concat(mustBeLoggedIn).concat(mustNotBeLoggedIn).reduce((hash: any, r) => {
		const {key} = r;
		if (undefined !== hash[key]) {
			console.log("Duplicate route key " + key)
			Sentry.captureMessage("Duplicate route key " + key);
		}
		hash[key] = true;
		return hash;
	}, {})

	return (
		<Router history={history}>
			<Switch>
				{...universalRoutes}
				{...authedDependedRoutes}
			</Switch>
		</Router>
	);
} 
