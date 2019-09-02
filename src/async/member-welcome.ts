import * as t from 'io-ts';
import APIWrapper, { ServerParams } from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString } from '../util/OptionalTypeValidators';

export const validator = t.type({
	parentPersonId: t.number,
	userName: t.string,
	hasEIIResponse: t.boolean,
	children: t.array(t.type({
		personId: t.number,
		nameFirst: OptionalString,
		nameLast: OptionalString,
		status: OptionalString,
		actions: OptionalString,
		ratings: OptionalString
	}))
})

type Result = t.TypeOf<typeof validator>

const path = "/member-welcome"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})