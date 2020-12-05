import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const singlePaymentValidator = t.type({
	paymentDate: t.string,
	paymentAmtCents: t.number
})

export const validator = t.array(t.array(singlePaymentValidator))

const path = "/member/payment-plan-options"

export const postResponseValidator = t.type({
	personId: t.number	
})

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
