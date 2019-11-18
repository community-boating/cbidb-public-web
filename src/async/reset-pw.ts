import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";

const path = "/reset-pw"

const postValidator = t.type({
	username: t.string,
	hash: t.string,
	password: t.string
})

const resultValidator = t.type({
	success: t.boolean
})

export const apiw = new APIWrapper<typeof resultValidator, t.TypeOf<typeof postValidator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: resultValidator
})
