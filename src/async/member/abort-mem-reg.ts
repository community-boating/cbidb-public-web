import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/member/abort-mem-reg"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: t.any,
	resultValidator: t.string
})