import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.type({
	firstName: OptionalString,
	lastName: OptionalString,
	middleInitial: OptionalString,
	dob: OptionalString,
	childEmail: OptionalString,
	addr1: OptionalString,
	addr2: OptionalString,
	addr3: OptionalString,
	city: OptionalString,
	state: OptionalString,
	zip: OptionalString,
	country: OptionalString,
	primaryPhone: OptionalString,
	primaryPhoneType: OptionalString,
	alternatePhone: OptionalString,
	alternatePhoneType: OptionalString,
	allergies: OptionalString,
	medications: OptionalString,
	specialNeeds: OptionalString
})

export const postValidator = t.type({
	personId: t.number	
})

const path = "/junior/required"

export const getWrapper = (personId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?personId=" + personId,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = (personId: number) => new APIWrapper<typeof postValidator, t.TypeOf<typeof validator>, {personId: number}>({
	path,
	type: HttpMethod.POST,
	resultValidator: postValidator,
	fixedParams: {personId}
})