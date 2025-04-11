import * as React from 'react';
import * as t from 'io-ts';
import { apPathPayments } from "app/paths/ap/payments";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setAPImage } from 'util/set-bg-image';
import ManageStaggeredPayments from 'containers/ManageStaggeredPayments';
import { PageFlavor } from 'components/Page';
import {Payment, validator} from "async/member/open-order-details-ap"
import {getWrapper as getPaymentsNew} from "async/member/square/get-staggered-payment-invoices"
import { apBasePath } from 'app/paths/ap/_base';
import { none } from 'fp-ts/lib/Option';
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { makePostJSON } from 'core/APIWrapperUtil';
import { ApiResult } from 'core/APIWrapperTypes';


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
		return getPaymentsNew.send(makePostJSON({orderAppAlias: PageFlavor.AP})).then(r => {
			if (r.type != "Success" || r.success.invoices.length == 0) {
				//history.push(apBasePath.getPathFromArgs({}));
				return {
					type: "Failure"
				} as ApiResult<Payment[]>
			} else {
				return {
					type: "Success",
					success: r.success.invoices[0].map (a => {
						return {
							amountCents: a.staggeredPrice,
							expectedDate: a.paymentDueDate,
							orderId: -1,
							paid: a.paid == 'Y',
							staggerId: a.staggerId,
							failedCron: a.cronError == 'Y'
						} as Payment
					})
				} as ApiResult<Payment[]>
			}
		})
		.catch(err => Promise.resolve({type: "Failure"} as ApiResult<Payment[]>));
	}}
	shadowComponent={<FactaLoadingPage setBGImage={setAPImage} />}
/>);
