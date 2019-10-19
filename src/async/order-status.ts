import * as t from 'io-ts';
import APIWrapper, { ServerParams } from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString, OptionalNumber, makeOptional } from '../util/OptionalTypeValidators';

export const cardDataValidator = t.type({
	token: t.string,
	orderId: t.number,
	last4: t.string,
	expMonth: t.string,
	expYear: t.string,
	zip: OptionalString
})

export type CardData = t.TypeOf<typeof cardDataValidator>;

export const orderStatusValidator = t.type({
	orderId: t.number,
	total: t.number,
	cardData: makeOptional(cardDataValidator, "CardData")
})

export type OrderStatus = t.TypeOf<typeof orderStatusValidator>;

type Result = t.TypeOf<typeof orderStatusValidator>

const path = "/order-status"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: orderStatusValidator,
})