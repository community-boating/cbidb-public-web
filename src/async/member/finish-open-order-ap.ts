import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

const validator = t.string

const path = "/member/finish-open-order-ap"

export const postWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.POST,
	resultValidator: validator
})
