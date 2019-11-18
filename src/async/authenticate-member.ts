import * as t from 'io-ts';
import APIWrapper, { PostString } from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";

const path = "/authenticate-member"

export const apiw = () => new APIWrapper<typeof t.boolean, PostString, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.boolean,
	extraHeaders: {
		"dont-redirect": "true"
	}
})
