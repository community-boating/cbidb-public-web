import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	personId: t.number
})

const path = "/junior/accept-tos"

export const apiw = new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {}
})