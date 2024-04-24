import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

// TODO: this is just for debug

export const validator = t.type({
	numberWorkers: t.number,
	childCount: t.number,
	income: t.number
})

const path = "/junior/scholarship-yes"

export const postWrapper = () => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	postBodyValidator: validator,
	fixedParams: {}
})