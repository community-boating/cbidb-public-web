import * as React from 'react';
import * as t from 'io-ts';

import {apDonateEditPath} from "app/paths/ap/donate-edit";
import RouteWrapper from "core/RouteWrapper";
import { PageFlavor } from 'components/Page';
import PageWrapper from 'core/PageWrapper';
import { setCheckoutImage } from 'util/set-bg-image';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import {getWrapper as getRecurringDonationsNew, resultValidator} from "async/member/square/get-recurring-donations"
import {getWrapper as getRecurringDonations, validator as getRecurringDonationsValidator} from "async/member/recurring-donations"
import { CartItem, apiw as getCartItems } from "async/get-cart-items"
import { getWrapper as getDonationFunds, validator as donationFundsValidator } from 'async/donation-funds';
import RecurringDonationsEdit from 'containers/recurring-donations/RecurringDonationsEdit';
import {getWrapper as getDonationHistory, validator as donationHistoryValidator} from "async/member/recurring-donation-history";
import { makePostJSON } from 'core/APIWrapperUtil';

type AsyncType = [t.TypeOf<typeof resultValidator>, t.TypeOf<typeof donationFundsValidator>, t.TypeOf<typeof donationHistoryValidator>, CartItem[]];

export const apDonateEditRoute = new RouteWrapper(true, apDonateEditPath, history => <PageWrapper
	key="DonateEditPage"
	history={history}
	component={(
		urlProps: {},
		[donations, funds, donationHistory, cartItems]: AsyncType
	) => <RecurringDonationsEdit
		history={history}
		program={PageFlavor.AUTO_DONATE}
		existingDonations={donations.recurringDonations}
		fundInfo={funds}
		donationHistory={donationHistory}
		cartItems={cartItems}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setCheckoutImage} />}
	getAsyncProps={(urlProps: {}) => {
		getRecurringDonationsNew.send(makePostJSON({
			orderAppAlias: PageFlavor.AUTO_DONATE
		})).then((a) => {
			console.log(a)
		})
		return Promise.all([
			getRecurringDonationsNew.send(makePostJSON({
				orderAppAlias: PageFlavor.AUTO_DONATE
			})),
			getDonationFunds.send(null),
			getDonationHistory.send(null),
			getCartItems(PageFlavor.AUTO_DONATE).send(null)
		]).catch(err => Promise.resolve(null));
	}}
/>);
