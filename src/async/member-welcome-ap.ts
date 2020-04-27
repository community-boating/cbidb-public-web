import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString } from '../util/OptionalTypeValidators';

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
	renewalDiscountAmt: t.number,
	expirationDate: OptionalString,
	show4thLink: t.boolean,
	canRenew: t.boolean,
	eligibleForSeniorOnline: t.boolean,
	eligibleForVeteranOnline: t.boolean,
	eligibleForYouthOnline: t.boolean,
})

const path = "/member-welcome-ap"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})