import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	wantIt: t.boolean
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/select-guest-privs"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})