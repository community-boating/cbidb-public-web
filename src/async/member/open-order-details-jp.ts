import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";


export const paymentValidator = t.type({
	amountCents: t.number,
	expectedDate: t.string,
	orderId: t.number,
	paid: t.boolean,
	staggerId: t.number,
	failedCron: t.boolean,
	squareInvoiceId: t.union([t.string, t.null, t.undefined])
});

export const validator = t.array(paymentValidator);

const path = "/member/open-order-details-jp"

export const getWrapper = (juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?juniorId=" + juniorId,
	type: HttpMethod.GET,
	resultValidator: validator
})
