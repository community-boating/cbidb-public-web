import { Option } from 'fp-ts/lib/Option';
import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export type PostType = {
	paymentMethodId: string
}

const resultValidator = t.type({
	success: t.boolean
})

const path = "/stripe/store-payment-method-jp"

export const postWrapper = (juniorId: Option<number>) => new APIWrapper<typeof resultValidator, PostType, {}>({
	path: path + juniorId.map(juniorId => "?juniorId=" + juniorId).getOrElse(""),
	type: HttpMethod.POST,
	resultValidator: resultValidator
})