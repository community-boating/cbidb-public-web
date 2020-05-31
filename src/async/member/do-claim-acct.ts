import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	personId: t.number,
	username: t.string,
	password: t.string,
	hash: t.string
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/do-claim-acct"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})