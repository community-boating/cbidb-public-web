import * as React from 'react';
import * as t from 'io-ts';

import {apDonatePath} from "app/paths/ap/donate";
import RouteWrapper from "core/RouteWrapper";
import { PageFlavor } from 'components/Page';
import PageWrapper from 'core/PageWrapper';
import { setCheckoutImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import RecurringDonationsSplash from 'containers/recurring-donations/RecurringDonationsSplash';
import {getWrapper as getRecurringDonations, validator as getRecurringDonationsValidator} from "async/member/recurring-donations"
import { getWrapper as getDonationFunds, validator as donationFundsValidator } from 'async/donation-funds';
import {getWrapper as getDonationHistory, validator as donationHistoryValidator} from "async/member/recurring-donation-history";
import optionify from 'util/optionify';
import { Option } from 'fp-ts/lib/Option';

type AsyncType = [t.TypeOf<typeof getRecurringDonationsValidator>, t.TypeOf<typeof donationFundsValidator>, t.TypeOf<typeof donationHistoryValidator>];

export const apDonateRoute = new RouteWrapper(true, apDonatePath, history => <PageWrapper
	key="DonatePage"
	history={history}
	component={(
		urlProps: {successMsg: Option<string>},
		[donations, funds, donationHistory]: AsyncType
	) => <RecurringDonationsSplash
		history={history}
		program={PageFlavor.AP}
		currentDonationPlan={donations}
		fundInfo={funds}
		donationHistory={donationHistory}
		successMsg={urlProps.successMsg}
	/>}
	urlProps={{
		successMsg: optionify((new URLSearchParams(history.location.search)).get("success"))
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
	getAsyncProps={(urlProps: {}) => {
		return Promise.all([
			getRecurringDonations.send(),
			getDonationFunds.send(),
			getDonationHistory.send(),
		]).catch(err => Promise.resolve(null));
	}}
/>);
