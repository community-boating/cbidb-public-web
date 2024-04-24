import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	doStaggeredPayments: t.boolean
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/set-payment-plan-jp"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator,
	postBodyValidator: validator,
	fixedParams: {}
})