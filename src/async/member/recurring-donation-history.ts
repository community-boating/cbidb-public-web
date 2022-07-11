import * as t from 'io-ts';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';
import APIWrapper from 'core/APIWrapper';

const path = "/member/recurring-donation-history";

export const donationHistoryValidator = t.type({
	orderId: t.number,
	donatedDate: t.string,
	fundId: t.number,
	amount: t.number,
})

export const validator = t.type({
	nextChargeDate: OptionalString,
	donationHistory: t.array(donationHistoryValidator)
});

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})
