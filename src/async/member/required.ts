import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';
import { Option, none } from 'fp-ts/lib/Option';

export const validator = t.type({
    namePrefix: OptionalString,
	firstName: OptionalString,
	lastName: OptionalString,
    middleInitial: OptionalString,
    nameSuffix: OptionalString,
	dob: OptionalString,
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
// TODO: way to avoid this duplication?
export const defaultValue: t.TypeOf<typeof validator> = {
    namePrefix: none as Option<string>,
	firstName: none as Option<string>,
	lastName: none as Option<string>,
    middleInitial: none as Option<string>,
    nameSuffix: none as Option<string>,
	dob: none as Option<string>,
	addr1: none as Option<string>,
	addr2: none as Option<string>,
	addr3: none as Option<string>,
	city: none as Option<string>,
	state: none as Option<string>,
	zip: none as Option<string>,
	country: none as Option<string>,
	primaryPhone: none as Option<string>,
	primaryPhoneType: none as Option<string>,
	alternatePhone: none as Option<string>,
	alternatePhoneType: none as Option<string>,
	allergies: none as Option<string>,
	medications: none as Option<string>,
	specialNeeds: none as Option<string>
}

export const postValidator = t.type({
	personId: t.number	
})

const path = "/member/required"

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: postValidator,
	postBodyValidator: validator,
	fixedParams: { }
})