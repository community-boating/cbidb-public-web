import * as t from 'io-ts';
import APIWrapper, { ServerParams } from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";

export const validator = t.type({
	value: t.string
})

const path = "/is-logged-in-as-member"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
