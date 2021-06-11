import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";

export type PostType = {
	paymentMethodId: string
}

const resultValidator = t.type({
	success: t.boolean
})

const path = "/stripe/store-payment-method-donate"

export const postWrapper = new APIWrapper<typeof resultValidator, PostType, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: resultValidator
})