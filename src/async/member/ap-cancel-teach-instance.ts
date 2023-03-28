import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {requestValidator} from "models/api-generated/member/ap-cancel-teach-instance/post"

const path = "/member/ap-cancel-teach-instance"

export const postWrapper = new APIWrapper<typeof t.string, t.TypeOf<typeof requestValidator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
})
