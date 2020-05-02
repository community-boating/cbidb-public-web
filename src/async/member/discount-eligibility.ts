import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	youth: t.boolean,
	senior: t.boolean,
	veteran: t.boolean,
	renew: t.boolean
})

const path = "/member/discount-eligibility"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})