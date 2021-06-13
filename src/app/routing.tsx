import * as Sentry from '@sentry/browser';
import { History } from 'history';
import * as React from 'react';
import { Redirect, Route, Router, Switch } from 'react-router';
import asc from './AppStateContainer';
import { Option } from 'fp-ts/lib/Option';
import {ratingsPageRoute} from './routes/jp/ratings'
import {regPageRoute} from './routes/jp/reg'
import {regEmptyPageRoute} from './routes/jp/regEmpty'
import {editPageRoute} from './routes/jp/edit'
import {classPageRoute} from './routes/jp/class'
import {classTimePageRoute} from './routes/jp/classTime'
import {signupNotePageRoute} from './routes/jp/signupNote'
import {checkoutPageRoute as checkoutPageRouteJP} from "./routes/checkout-jp"
import {checkoutPageRoute as checkoutPageRouteAP} from "./routes/checkout-ap"
import { maintenancePageRoute } from './routes/common/maintenance';
import { jpForgotPasswordPageRoute } from './routes/jp/forgot-pw';
import { jpForgotPasswordSentPageRoute } from './routes/jp/forgot-pw-sent';
import { jpResetPasswordPageRoute } from './routes/jp/reset-pw';
import { jpHomePageRoute } from './routes/jp/_base';
import { apHomePageRoute } from './routes/ap/_base';
import PathWrapper from '@core/PathWrapper';
import { offseasonPageRoute } from './routes/jp/offseason'
import { apRegPageRoute } from './routes/ap/reg';
import { apEditPageRoute } from './routes/ap/edit';
import { fundInfoRoute } from './routes/common/funds';
import { apPreRegRoute } from './routes/ap/prereg';
import { apGuestRegRoute } from './routes/ap/guest-reg';
import { apCreateAcctRoute } from './routes/ap/create-acct';
import { apForgotPasswordPageRoute } from './routes/ap/forgot-pw';
import { apForgotPasswordSentPageRoute } from './routes/ap/forgot-pw-sent';
import { apResetPasswordPageRoute } from './routes/ap/reset-pw';
import { assertUniqueKeys } from '@util/assertUniqueKeys';
import { jpRegClosedPageRoute } from './routes/jp/closed';
import { apStartClaimAcctPageRoute } from './routes/ap/start-claim-acct';
import { apClaimAcctSentPageRoute } from './routes/ap/claim-acct-sent';
import { apDoClaimAcctPageRoute } from './routes/ap/do-claim-acct';
import { reservePageRoute } from './routes/jp/reserve';
import { reserveNotesPageRoute } from './routes/jp/reserve-notes';
import { createAcctPageRoute } from './routes/jp/create-acct';
import { apClassesPageRoute } from './routes/ap/classes';
import { apSettingsPageRoute } from './routes/ap/settings';
import { apLoginPageRoute } from './routes/ap/login';
import { jpLoginPageRoute } from './routes/jp/login';
import { apBasePath } from './paths/ap/_base';
import { apPathLogin } from './paths/ap/login';
import { jpPathLogin } from './paths/jp/login';
import { jpBasePath } from './paths/jp/_base';
import LoginRoute from "@routes/common/login";
import { PageFlavor } from '@components/Page';
import { apAddonsPageRoute } from './routes/ap/addons';
import { apDonateRoute } from './routes/ap/donate';
import { apClosedPageRoute } from './routes/ap/closed';
import { donatePageRoute } from "@routes/donate"
import { apManageStaggeredPaymentsRoute } from './routes/ap/payments';
import { jpManageStaggeredPaymentsRoute } from './routes/jp/payments';
import { giftCertificatesPageRoute } from "@routes/gift-certificates"
import {standaloneLoginRoute} from "@routes/common/standalone-signin"
import { jpSettingsPageRoute } from '@routes/jp/settings';
import LandingPage from '@containers/LandingPage';
import { jpPublicClassesRoute } from '@routes/jp/all-classes';
import { apDonateEditRoute } from '@routes/ap/donate-edit';

const defaultRouteRender = () => {
	// console.log("uncaught path...", window.location.pathname)
	const redirectRegex = /^\/redirect\/(.*)$/;
	const redirectRegexMatchResult = redirectRegex.exec(window.location.pathname);
	if (redirectRegexMatchResult) {
		// First see if its a redirect
		// console.log("... its a redirect, going to " + redirectRegexMatchResult[1]);
		return <Redirect to={'/' + redirectRegexMatchResult[1] + window.location.search + window.location.hash} />;
	} else {
		// console.log("its not a redirect....")
		const jpRegex = /^\/jp\/(.*)$/;
		const jpRegexMatchResult = jpRegex.exec(window.location.pathname);
		if (jpRegexMatchResult) {
			// console.log("it does have a jp in front and its still nothing.  GIve up")
			const apRegex = /^\/jp\/ap\/(.*)$/;
			const apRegexMatchResult = apRegex.exec(window.location.pathname);
			if (apRegexMatchResult) {
				return <Redirect to={apPathLogin.getPathFromArgs({})} />;
			} else {
				return <Redirect to={jpPathLogin.getPathFromArgs({})} />;
			}
		} else {
			// console.log("... its doesnt have a jp in front, lets try adding one")
			// Sentry.captureMessage("Uncaught route " + window.location.pathname)
			return <Redirect to={'/jp/' + PathWrapper.removeLeadingTrailingSlashes(window.location.pathname)} />;
		}
	}
};

// TODO: real shadow components on everything
export default function (history: History<any>) {
	const universalRoutes = assertUniqueKeys([
		<Route key="homeExplicit" path="/home" render={() => <Redirect to="/" />} />,
		<Route key="noProgram" path="/" exact render={() => <LandingPage history={history} />} />,
		maintenancePageRoute.asRoute(history),
		fundInfoRoute.asRoute(history),
		asc.state.jpRegistrationClosed ? null : reservePageRoute.asRoute(history),
		asc.state.jpRegistrationClosed ? null : reserveNotesPageRoute.asRoute(history),
		asc.state.jpRegistrationClosed ? null : createAcctPageRoute.asRoute(history),
		asc.state.jpRegistrationClosed ? jpRegClosedPageRoute.asRoute(history) : null,
		jpForgotPasswordPageRoute.asRoute(history),
		jpForgotPasswordSentPageRoute.asRoute(history),
		apForgotPasswordPageRoute.asRoute(history),
		apForgotPasswordSentPageRoute.asRoute(history),
		jpResetPasswordPageRoute.asRoute(history),
		apResetPasswordPageRoute.asRoute(history),
		apPreRegRoute.asRoute(history),
		apGuestRegRoute.asRoute(history),
		apCreateAcctRoute.asRoute(history),
		apClosedPageRoute.asRoute(history),
		apStartClaimAcctPageRoute.asRoute(history),
		apClaimAcctSentPageRoute.asRoute(history),
		apDoClaimAcctPageRoute.asRoute(history),
		apLoginPageRoute.asRoute(history),
		jpLoginPageRoute.asRoute(history),
		giftCertificatesPageRoute.asRoute(history),
		donatePageRoute.asRoute(history),
		standaloneLoginRoute.asRoute(history),
		jpPublicClassesRoute.asRoute(history),
	].filter(Boolean));

	const mustNotBeLoggedIn = [
		// If the url is /ap/something, stay on that path but render the login page.
		// After login, the login page will not navigate anywhere and render the requested deeplink
		// not using the 'exact' keyword here means the path /ap will match any /ap/foo/bar etc
		<Route key="apLoginRenderDeeplink" path={apBasePath.getPathFromArgs({})} render={() => LoginRoute(PageFlavor.AP)(history)} />,
		<Route key="jpLoginRenderDeeplink" path={jpBasePath.getPathFromArgs({})} render={() => LoginRoute(PageFlavor.JP)(history)} />
	]

	const mustBeLoggedIn = assertUniqueKeys([
		checkoutPageRouteJP.asRoute(history),
		checkoutPageRouteAP.asRoute(history),
		ratingsPageRoute.asRoute(history),
		classPageRoute.asRoute(history),
		signupNotePageRoute.asRoute(history),
		classTimePageRoute.asRoute(history),
		regPageRoute.asRoute(history),
		editPageRoute.asRoute(history),
		regEmptyPageRoute.asRoute(history),
		offseasonPageRoute.asRoute(history),
		apRegPageRoute.asRoute(history),
		apEditPageRoute.asRoute(history),
		apSettingsPageRoute.asRoute(history),
		jpSettingsPageRoute.asRoute(history),
		jpManageStaggeredPaymentsRoute.asRoute(history),
		jpHomePageRoute.asRoute(history),
		apClassesPageRoute.asRoute(history),
		apAddonsPageRoute.asRoute(history),
		apManageStaggeredPaymentsRoute.asRoute(history),
		apDonateEditRoute.asRoute(history),
		apDonateRoute.asRoute(history),
		(
			asc.state.justLoggedIn
			? <Route key="homeAP" path={apBasePath.getPathFromArgs({})} exact render={() => <Redirect to={apRegPageRoute.getPathFromArgs({})} />} />
			: apHomePageRoute.asRoute(history)
		),
	].filter(Boolean));

	const finalRoute = <Route key="defaultPub" render={defaultRouteRender} />;

	const isLoggedIn = (asc.state.login.authenticatedUserName as Option<string>).isSome();

	const routes = (
		isLoggedIn
		? universalRoutes.concat(mustBeLoggedIn).concat([finalRoute])
		: universalRoutes.concat(mustNotBeLoggedIn).concat([finalRoute])
	);

	// check on boot for duplicate route keys
	[routes].forEach(routeSet => routeSet.reduce((hash: any, r) => {
		const {key} = r;
		if (undefined !== hash[key]) {
			console.log("Duplicate route key " + key)
			Sentry.captureMessage("Duplicate route key " + key);
		}
		hash[key] = true;
		return hash;
	}, {}));

	return (
		<Router history={history}>
			<Switch>
				{routes.filter(Boolean)}
			</Switch>
		</Router>
	);
} 
