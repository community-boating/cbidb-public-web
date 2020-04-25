import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

const path = "/member/accept-tos"

export const apiw = new APIWrapper<typeof t.string, {}, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {}
})