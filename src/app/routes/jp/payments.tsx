import * as React from 'react';
import * as t from 'io-ts';
import { jpPathPayments } from "../../paths/jp/payments";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setJPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ManageStaggeredPayments from '../../../containers/ManageStaggeredPayments';
import { PageFlavor } from '../../../components/Page';
import {getWrapper, validator} from "@async/member/open-order-details-jp"
import { some } from 'fp-ts/lib/Option';
import { jpBasePath } from '../../paths/jp/_base';
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
		return getWrapper(urlProps.juniorId).send(null)
		.then(r => {
			if (r.type != "Success" || r.success.length == 0) {
				console.log("fail ", r)
				history.push(jpBasePath.getPathFromArgs({}));
			} else {
				return r;
			}
		})
		.catch(err => Promise.resolve(null));
	}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setJPImage} />}
/>);
