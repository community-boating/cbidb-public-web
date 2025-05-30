import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const validator = t.type({
	fundId: t.number,
	amount: t.number,
	program: t.string,
	inMemoryOf: t.union([t.string, t.null, t.undefined])
})

const path = "/member/add-donation"

export const postWrapper = new APIWrapper<typeof t.any, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	fixedParams: {}
})