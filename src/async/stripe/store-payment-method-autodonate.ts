import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const postBodyValidator = t.type({
	paymentMethodId: t.string
})

export type PostType = t.TypeOf<typeof postBodyValidator>

const resultValidator = t.type({
	success: t.boolean
})

const path = "/stripe/store-payment-method-autodonate"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	postBodyValidator,
	resultValidator
})