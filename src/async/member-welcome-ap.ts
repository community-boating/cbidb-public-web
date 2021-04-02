import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";
import { OptionalNumber, OptionalString } from '@util/OptionalTypeValidators';

export const discountsValidator = t.type({
	eligibleForSeniorOnline: t.boolean,
	eligibleForYouthOnline: t.boolean,
	eligibleForVeteranOnline: t.boolean,
	eligibleForStudent: t.boolean,
	eligibleForMGH: t.boolean,
	eligibleForTeachersAssn: t.boolean,
	seniorAvailable: t.boolean,
	youthAvailable: t.boolean,
	canRenew: t.boolean,
	renewalDiscountAmt: t.number,
	seniorDiscountAmt: t.number,
	youthDiscountAmt: t.number,
	studentDiscountAmt: t.number,
	veteranDiscountAmt: t.number,
	mghDiscountAmt: t.number,
	maTeachersAssnAmt: t.number,
	fyBasePrice: t.number,
})

export const validator = t.type({
	personId: t.number,
	orderId: t.number,
	firstName: t.string,
	lastName: t.string,
	userName: t.string,
	serverTime: t.string,
	season: t.number,
	status: t.string,
	actions: t.number,
	ratings: t.string,
	canCheckout: t.boolean,
	expirationDate: OptionalString,
	show4thLink: t.boolean,
	discountsResult: discountsValidator,
	openStaggeredOrderId: OptionalNumber,
})

const path = "/member-welcome-ap"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})
