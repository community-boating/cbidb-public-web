import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	instanceId: t.number
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/ap-class-unenroll"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})