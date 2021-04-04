import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";
import { OptionalString } from '@util/OptionalTypeValidators';

export const validator = t.type({
	emerg1Name: OptionalString,
	emerg1Relation: OptionalString,
	emerg1PhonePrimary: OptionalString,
	emerg1PhonePrimaryType: OptionalString,
	emerg1PhoneAlternate: OptionalString,
	emerg1PhoneAlternateType: OptionalString,

	emerg2Name: OptionalString,
	emerg2Relation: OptionalString,
	emerg2PhonePrimary: OptionalString,
	emerg2PhonePrimaryType: OptionalString,
	emerg2PhoneAlternate: OptionalString,
	emerg2PhoneAlternateType: OptionalString
})

const path = "/member/emerg"

export const postResponseValidator = t.type({
	personId: t.number	
})

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof postResponseValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: postResponseValidator,
	fixedParams: {}
})