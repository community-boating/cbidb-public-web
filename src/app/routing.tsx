import { History } from 'history';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import { apiw as welcomeAPI } from "../async/member-welcome";
import PageWrapper from '../core/PageWrapper';
import HomePage, { Form as HomePageForm } from '../containers/HomePage';
import LoginPage from '../containers/LoginPage';
import Currency from '../util/Currency';
import extractURLParams from '../util/extractURLParams';
import asc from './AppStateContainer';
import { Option, none, some } from 'fp-ts/lib/Option';
import {getWrapper as getProtoPersonCookie} from "../async/check-proto-person-cookie"
import {apiw as getStaticYearly} from "../async/static-yearly-data"
import ForgotPasswordPage from '../containers/ForgotPasswordPage';
import NewPasswordPage from '../containers/NewPasswordPage';
import ForgotPasswordSentPage from '../containers/ForgotPasswordSent';
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

function pathAndParamsExtractor<T extends {[K: string]: string}>(path: string) {
	return {
		path,
		getParams: extractURLParams<T>(path)
	}
}

export const paths = {
	resetPassword: pathAndParamsExtractor<{email: string, hash: string}>("/reset-pw/:email/:hash"),
}

// TODO: real shadow components on everything
export default function (history: History<any>) {
	// TODO: auto create all these redirect routes?
	const mustNotBeLoggedIn = [
		<Route key="/redirect/reserve" path="/redirect/reserve" render={() => <Redirect to="/reserve" />} />,
		<Route key="/redirect/create-acct" path="/redirect/create-acct" render={() => <Redirect to="/create-acct" />} />,
		
		reservePageRoute.asRoute(history),

		reserveNotesPageRoute.asRoute(history),

		createAcctPageRoute.asRoute(history),
		
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
		<Route key={`/redirect${classTimePageRoute.pathWrapper.path}`} path={`/redirect${classTimePageRoute.pathWrapper.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${classTimePageRoute.pathWrapper.path}`).getParams(history.location.pathname);
			const path = classTimePageRoute.pathWrapper.getPathFromArgs({ personId: params.personId, typeId: params.typeId });
			return <Redirect to={path} />;
		}}/>,
		<Route key={`/redirect${classPageRoute.pathWrapper.path}`} path={`/redirect${classPageRoute.pathWrapper.path}`} render={() => {
			const params = pathAndParamsExtractor<{personId: string, typeId: string}>(`/redirect${classPageRoute.pathWrapper.path}`).getParams(history.location.pathname);
			const path = classPageRoute.pathWrapper.getPathFromArgs({ personId: params.personId });
			return <Redirect to={path} />;
		}}/>,
		
		checkoutPageRoute.asRoute(history),

		thankyouPageRoute.asRoute(history),

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
		maintenancePageRoute.asRoute(history)
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