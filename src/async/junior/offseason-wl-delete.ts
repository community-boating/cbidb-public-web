import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const postValidator = t.type({
	juniorId: t.number
})

const path = "/junior/offseason-wl-delete"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: postValidator,
	resultValidator: t.string
})