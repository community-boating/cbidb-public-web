import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

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

const path = "/junior/emerg"

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