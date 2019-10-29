import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	doEnroll: t.boolean
})

const path = "/junior/class-signup"

export const postWrapper = new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {}
})