import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	fundId: t.number,
	amount: t.number
})

const path = "/member/delete-donation"

export const postWrapper = new APIWrapper<typeof t.any, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	fixedParams: {}
})