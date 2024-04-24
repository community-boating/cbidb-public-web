import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/proto-detach-member"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: t.any,
	resultValidator: t.string
})

