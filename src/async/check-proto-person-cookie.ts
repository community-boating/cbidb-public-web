import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

export const validator = t.any

const path = "/check-proto-person-cookie"

export const postWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.POST,
	resultValidator: validator
})