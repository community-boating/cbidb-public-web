import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { PostString } from 'core/APIWrapperTypes';

const path = "/member/prove-member-scala"

export const apiw = new APIWrapper<typeof t.boolean, PostString, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.boolean,
})
