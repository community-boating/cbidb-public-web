import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
	juniorId: t.number,
	instanceId: t.number,
	signupNote: OptionalString
})

const path = "/junior/signup-note-proto"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: validator,
	postBodyValidator: validator,
	fixedParams: { }
})