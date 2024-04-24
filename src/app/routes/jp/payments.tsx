import * as React from 'react';
import * as t from 'io-ts';
import { jpPathPayments } from "app/paths/jp/payments";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setJPImage } from 'util/set-bg-image';
import ManageStaggeredPayments from 'containers/ManageStaggeredPayments';
import { PageFlavor } from 'components/Page';
import {getWrapper, validator} from "async/member/open-order-details-jp"
import { some } from 'fp-ts/lib/Option';
import { jpBasePath } from 'app/paths/jp/_base';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
export const jpManageStaggeredPaymentsRoute = new RouteWrapper(true, jpPathPayments, history => <PageWrapper
	key="jp-payments"
	history={history}
	component={(urlProps: {juniorId: number}, async: t.TypeOf<typeof validator>) => <ManageStaggeredPayments
		history={history}
		program={PageFlavor.JP}
		juniorId={some(urlProps.juniorId)}
		payments={async}
	/>}
	urlProps={{
		juniorId: Number(jpPathPayments.extractURLParams(history.location.pathname).juniorId),
	}}
	getAsyncProps={(urlProps: {juniorId: number}) => {
		return getWrapper(urlProps.juniorId).send()
		.then(r => {
			if (r.type != "Success" || r.success.length == 0) {
				history.push(jpBasePath.getPathFromArgs({}));
			} else {
				return r;
			}
		})
		.catch(err => Promise.resolve(null));
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
/>);
