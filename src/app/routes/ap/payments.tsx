import * as React from 'react';
import * as t from 'io-ts';
import { apPathPayments } from "../../paths/ap/payments";
import PageWrapper from "../../../core/PageWrapper";
import RouteWrapper from "../../../core/RouteWrapper";
import { setAPImage } from '../../../util/set-bg-image';
import JoomlaLoadingPage from '../../../theme/joomla/JoomlaLoadingPage';
import ManageStaggeredPayments from '../../../containers/ManageStaggeredPayments';
import { PageFlavor } from '../../../components/Page';
import {getWrapper, validator} from "@async/member/open-order-details-ap"
import { apBasePath } from '../../paths/ap/_base';
import { none } from 'fp-ts/lib/Option';


export const apManageStaggeredPaymentsRoute = new RouteWrapper(true, apPathPayments, history => <PageWrapper
	key="payments"
	history={history}
	component={(urlProps: {}, async: t.TypeOf<typeof validator>) => <ManageStaggeredPayments
		history={history}
		program={PageFlavor.AP}
		payments={async}
		juniorId={none}
	/>}
	urlProps={{}}
	getAsyncProps={(urlProps: {}) => {
		return getWrapper.send(null)
		.then(r => {
			if (r.type != "Success" || r.success.length == 0) {
				console.log("fail ", r)
				history.push(apBasePath.getPathFromArgs({}));
			} else {
				return r;
			}
		})
		.catch(err => Promise.resolve(null));
	}}
	shadowComponent={<JoomlaLoadingPage setBGImage={setAPImage} />}
/>);
