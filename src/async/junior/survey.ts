import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalBoolean, OptionalString, OptionalStringList } from 'util/OptionalTypeValidators';

export const validator = t.type({
	genderID: OptionalString,
	referral: OptionalStringList,
	referralOther: OptionalString,
	language: OptionalString,
	ethnicity: OptionalStringList,
	ethnicityOther: OptionalString,
	school: OptionalString,
	freeLunch: OptionalBoolean
})

const path = "/junior/survey"

export const getWrapper = (personId: number) => new APIWrapper({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	postBodyValidator: validator,
	fixedParams: {personId}
})