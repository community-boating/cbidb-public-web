import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const path = "/authenticate-member"

export const apiw = () => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.boolean,
	postBodyValidator: t.any,
	extraHeaders: {
		"dont-redirect": "true"
	}
})
