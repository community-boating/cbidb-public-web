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
});

export const validator = t.array(paymentValidator);

const path = "/member/open-order-details-ap"

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
