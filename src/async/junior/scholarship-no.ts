import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

// TODO: this is just for debug

export const validator = t.type({

})

const path = "/junior/scholarship-no"

export const postWrapper = () => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	postBodyValidator: validator,
	fixedParams: {}
})