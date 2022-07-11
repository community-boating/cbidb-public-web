import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	juniorId: t.number,
	instanceId: t.number,
	doEnroll: t.boolean
})

const resultValidator = t.type({
	signupId: t.number
})

const path = "/junior/class-signup"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})