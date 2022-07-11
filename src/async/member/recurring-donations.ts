import * as t from 'io-ts';
import { HttpMethod } from "core/HttpMethod";
import { makeOptional } from 'util/OptionalTypeValidators';
import APIWrapper from 'core/APIWrapper';
import { cardDataValidator } from 'async/order-status';

const path = "/member/get-recurring-donations";

const setPath = "/member/set-recurring-donations";


export const donationValidator = t.type({
	fundId: t.number,
	amountInCents: t.number,
});

export const validator = t.type({
	recurringDonations: t.array(donationValidator),
	paymentMethod: makeOptional(cardDataValidator, "paymentMethod"),
})

const postResponseValidator = t.type({success: t.boolean})

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof postResponseValidator, typeof validator, {}>({
	path: setPath,
	type: HttpMethod.POST,
	resultValidator: postResponseValidator
})