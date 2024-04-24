import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/member/accept-tos"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	postBodyValidator: t.any,
	fixedParams: {}
})