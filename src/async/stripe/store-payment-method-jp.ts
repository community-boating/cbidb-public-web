import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const postBodyValidator = t.type({
	paymentMethodId: t.string,
	retryLatePayments: t.boolean
})

export type PostType = t.TypeOf<typeof postBodyValidator>

const resultValidator = t.type({
	success: t.boolean
})

const path = "/stripe/store-payment-method-jp"

export const postWrapper = (juniorId: Option<number>) => new APIWrapper({
	path: path + juniorId.map(juniorId => "?juniorId=" + juniorId).getOrElse(""),
	type: HttpMethod.POST,
	postBodyValidator,
	resultValidator
})