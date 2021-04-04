import * as React from 'react';
import * as t from 'io-ts';
import {apDonatePath} from "@paths/ap/donate";
import RouteWrapper from "@core/RouteWrapper";
import { PageFlavor } from '@components/Page';
import RecurringDonations from '@containers/RecurringDonations';
import PageWrapper from '@core/PageWrapper';
import {getWrapper as getRecurringInfo, resultValidator as getRecurringInfoValidator} from "@async/stripe/get-recurring-info"
import { setAPImage } from '@util/set-bg-image';
import FactaLoadingPage from '@facta/FactaLoadingPage';

export const apDonateRoute = new RouteWrapper(true, apDonatePath, history => <PageWrapper
	key="DonatePage"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof getRecurringInfoValidator>) => <RecurringDonations
		history={history}
		recurringDonationInfo={async}
		program={PageFlavor.AP}
	/>}
	urlProps={{}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
	getAsyncProps={() => {
		return getRecurringInfo.send(null).catch(err => Promise.resolve(null));  // TODO: handle failure
	}}
/>);
