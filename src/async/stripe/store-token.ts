import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export type PostType = {
	token: string,
	orderId: number
}

const resultValidator = t.type({
	token: t.string,
	orderId: t.number,
	last4: t.string,
	expMonth: t.string,
	expYear: t.string,
	zip: OptionalString
})

const path = "/stripe/store-token"

export const postWrapper = new APIWrapper<typeof resultValidator, PostType, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: resultValidator
})