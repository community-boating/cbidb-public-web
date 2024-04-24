import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	juniorId: t.number,
	instanceId: t.number,
	keepInstanceId: t.number,
	doEnroll: t.boolean,
	deleteEnrollment: t.boolean
})

const resultValidator = t.type({
	signupId: t.number
})

const path = "/junior/class-signup"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator,
	postBodyValidator: validator,
	fixedParams: {}
})