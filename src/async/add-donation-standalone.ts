import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";
import { OptionalBoolean, OptionalString } from '@util/OptionalTypeValidators';

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

export const postWrapper = new APIWrapper<typeof t.any, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: t.any,
	fixedParams: {}
})