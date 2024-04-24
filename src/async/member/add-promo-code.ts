import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	promoCode: t.string,
	program: t.string
})

const path = "/member/add-promo-code"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	postBodyValidator: t.any,
	fixedParams: {}
})