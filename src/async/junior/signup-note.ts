import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
	juniorId: t.number,
	instanceId: t.number,
	signupNote: OptionalString
})

const path = "/junior/signup-note"

export const getWrapper = (juniorId: number, instanceId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + `?juniorId=${juniorId}&instanceId=${instanceId}`,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: { }
})