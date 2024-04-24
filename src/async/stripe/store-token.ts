import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

const postBodyValidator = t.type({
	token: t.string,
	orderId: t.number
})

export type PostType = t.TypeOf<typeof postBodyValidator>

const resultValidator = t.type({
	token: t.string,
	orderId: t.number,
	last4: t.string,
	expMonth: t.number,
	expYear: t.number,
	zip: OptionalString
})

const path = "/stripe/store-token"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator,
	resultValidator
})