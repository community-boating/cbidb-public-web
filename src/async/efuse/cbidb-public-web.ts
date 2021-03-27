import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

export const validator = t.number

const path = "/efuse/cbidb-public-web"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
