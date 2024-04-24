import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {requestValidator} from "models/api-generated/member/ap-teach-instance/post"

const path = "/member/ap-teach-instance"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator: requestValidator,
	resultValidator: t.string,
})
