import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalBoolean, OptionalString, OptionalStringList } from '../../util/OptionalTypeValidators';

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

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper<typeof t.string, t.TypeOf<typeof validator>, {personId: number}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {personId}
})