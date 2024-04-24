import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	fundId: t.number,
	amount: t.number,
	program: t.string
})

const path = "/member/delete-donation"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	postBodyValidator: validator,
	fixedParams: {}
})