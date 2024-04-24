import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/forgot-pw"

const postValidator = t.type({
	email: t.string,
	program: t.string
})

const resultValidator = t.type({
	success: t.boolean
})

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: postValidator,
	resultValidator: resultValidator
})

