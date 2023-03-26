import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import {path, responseSuccessValidator} from "models/api-generated/member/ap-class-instances-instructor-info/get"

export type ApClassInstanceInstructorInfo = t.TypeOf<typeof responseSuccessValidator>[number]

export const getWrapper = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: responseSuccessValidator
})