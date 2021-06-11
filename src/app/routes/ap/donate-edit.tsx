import * as React from 'react';
import * as t from 'io-ts';

import {apDonateEditPath} from "@paths/ap/donate-edit";
import RouteWrapper from "@core/RouteWrapper";
import { PageFlavor } from '@components/Page';
import PageWrapper from '@core/PageWrapper';
import { setCheckoutImage } from '@util/set-bg-image';
import FactaLoadingPage from '@facta/FactaLoadingPage';
import {getWrapper as getRecurringDonations, validator as getRecurringDonationsValidator} from "@async/member/recurring-donations"
import { getWrapper as getDonationFunds, validator as donationFundsValidator } from '@async/donation-funds';
import RecurringDonationsEdit from '@containers/recurring-donations/RecurringDonationsEdit';
import {getWrapper as getDonationHistory, validator as donationHistoryValidator} from "@async/member/recurring-donation-history";

type AsyncType = [t.TypeOf<typeof getRecurringDonationsValidator>, t.TypeOf<typeof donationFundsValidator>, t.TypeOf<typeof donationHistoryValidator>];

export const apDonateEditRoute = new RouteWrapper(true, apDonateEditPath, history => <PageWrapper
	key="DonateEditPage"
	history={history}
	component={(
		urlProps: {},
		[donations, funds, donationHistory]: AsyncType
	) => <RecurringDonationsEdit
		history={history}
		program={PageFlavor.AP}
		initialDonationPlan={donations}
		fundInfo={funds}
		donationHistory={donationHistory}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
	getAsyncProps={(urlProps: {}) => {
		return Promise.all([
			getRecurringDonations.send(null),
			getDonationFunds.send(null),
			getDonationHistory.send(null),
		]).catch(err => Promise.resolve(null));
	}}
/>);
