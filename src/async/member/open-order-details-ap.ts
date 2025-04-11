import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export type Payment = t.TypeOf<typeof paymentValidator>
export type PaymentList = t.TypeOf<typeof validator>

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

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
