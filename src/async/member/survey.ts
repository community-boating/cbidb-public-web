import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString, OptionalStringList } from 'util/OptionalTypeValidators';

export const validator = t.type({
	genderID: OptionalString,
	referral: OptionalStringList,
    referralOther: OptionalString,
    occupation: OptionalString,
    employer: OptionalString,
    matchingContributions: OptionalString,
	language: OptionalString,
	ethnicity: OptionalStringList,
	ethnicityOther: OptionalString,
	student: OptionalString,
	school: OptionalString
})

const path = "/member/survey"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {}
})