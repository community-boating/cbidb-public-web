import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const discountsValidator = t.type({
	discountId: t.number,
	discountAmt: t.number
});

const membershipsValidator = t.type({
	membershipId: t.number,
	membershipBasePrice: t.number,
	discounts: t.array(discountsValidator)
});

export const validator = t.type({
	memberships: t.array(membershipsValidator),
	guestPrivsPrice: t.number,
	damageWaiverPrice: t.number,
	apClassPrice: t.number,
})

const path = "/prices"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})