import * as t from 'io-ts';
import { PageFlavor } from '@components/Page';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";
import { OptionalString, makeOptional } from '@util/OptionalTypeValidators';

export const cardDataValidator = t.type({
	last4: t.string,
	expMonth: t.number,
	expYear: t.number,
	zip: OptionalString
})

export type CardData = t.TypeOf<typeof cardDataValidator>;

export const staggeredPaymentValidator = t.type({
	paymentDate: t.string,
	paymentAmtCents: t.number
});

export type StaggeredPayment = t.TypeOf<typeof staggeredPaymentValidator>;

export const orderStatusValidator = t.type({
	orderId: t.number,
	total: t.number,
	paymentMethodRequired: t.boolean,
	cardData: makeOptional(cardDataValidator, "CardData"),
	staggeredPayments: t.array(staggeredPaymentValidator),
	jpAvailablePaymentSchedule: t.array(staggeredPaymentValidator),
	nameFirst: OptionalString,
	nameLast: OptionalString,
	email: OptionalString,
	authedAsRealPerson: t.boolean,
})

export type OrderStatus = t.TypeOf<typeof orderStatusValidator>;

const path = "/order-status"

export const apiw = (program: PageFlavor) => new APIWrapper({
	path: path + "?program=" + program,
	type: HttpMethod.GET,
	resultValidator: orderStatusValidator,
})