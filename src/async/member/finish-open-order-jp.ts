import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

const validator = t.string

const path = "/member/finish-open-order-jp"

export const postWrapper = (juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path+"?juniorId=" + juniorId,
	type: HttpMethod.POST,
	resultValidator: validator
})
