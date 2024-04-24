import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber } from 'util/OptionalTypeValidators';

export const singlePaymentValidator = t.type({
	paymentDate: t.string,
	paymentAmtCents: t.number
})

export const scmValidator = t.type({
	addlStaggeredPayments: t.number,
	basePriceDollars: t.number,
	discountAmtDollars: OptionalNumber,
	discountId: OptionalNumber,
	membershipTypeId: t.number
})

export const planValidator = t.type({
	payments: t.array(singlePaymentValidator),
	startDate: t.string,
})

export const validator = t.type({
	scm: scmValidator,
	plans: t.array(planValidator)
})

const path = "/member/payment-plan-options"

export const postResponseValidator = t.type({
	personId: t.number	
})

export const getWrapper = new APIWrapper({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
