import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalBoolean, OptionalString } from 'util/OptionalTypeValidators';
import { makeOptionalProps } from './util/Optional';

export const validator = t.type({
	fundId: t.number,
	amount: t.number,
	inMemoryOf: OptionalString,
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: OptionalString,
	doRecurring: OptionalBoolean,
})

const path = "/add-donation-standalone"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	postBodyValidator: makeOptionalProps(validator),
	fixedParams: {}
})