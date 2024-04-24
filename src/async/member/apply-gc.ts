import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	gcNumber: t.number,
	gcCode: t.string,
	program: t.string
})

const path = "/member/apply-gc"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	postBodyValidator: validator,
	fixedParams: {}
})