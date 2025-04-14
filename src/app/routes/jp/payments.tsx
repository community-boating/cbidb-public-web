import * as React from 'react';
import * as t from 'io-ts';
import { jpPathPayments } from "app/paths/jp/payments";
import PageWrapper from "core/PageWrapper";
import RouteWrapper from "core/RouteWrapper";
import { setJPImage } from 'util/set-bg-image';
import ManageStaggeredPayments from 'containers/ManageStaggeredPayments';
import { PageFlavor } from 'components/Page';
import { validator } from "async/member/open-order-details-jp"
import { some } from 'fp-ts/lib/Option';
import {getWrapper as getPaymentsNew} from "async/member/square/get-staggered-payment-invoices"
import FactaLoadingPage from 'theme/facta/FactaLoadingPage';
import { makePostJSON } from 'core/APIWrapperUtil';
import { ApiResult } from 'core/APIWrapperTypes';
import { Payment } from 'async/member/open-order-details-ap';
import { jpBasePath } from 'app/paths/jp/_base';
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
			return getPaymentsNew.send(makePostJSON({orderAppAlias: PageFlavor.JP, membershipPersonId: urlProps.juniorId})).then(r => {
				if (r.type != "Success" || r.success.invoices.length == 0) {
					console.log("WHAT ME BIG TIME HELLO")
					console.log(r)
					history.push(jpBasePath.getPathFromArgs({}));
					return {
						type: "Failure"
					} as ApiResult<Payment[]>
				} else {
					return {
						type: "Success",
						success: r.success.invoices[0].map (a => {
							return {
								amountCents: a.staggerPrice,
								expectedDate: a.paymentDueDate,
								orderId: -1,
								paid: a.paid == 'Y',
								staggerId: a.staggerId,
								failedCron: a.cronError == 'Y',
								squareInvoiceId: a.squareInvoiceId
							} as Payment
						})
					} as ApiResult<Payment[]>
				}
			})
			.catch(err => Promise.resolve({type: "Failure"} as ApiResult<Payment[]>));
		}}
	shadowComponent={<FactaLoadingPage setBGImage={setJPImage} />}
/>);
