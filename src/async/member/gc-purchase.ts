import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.type({
	valueInCents: t.number,
	purchasePriceCents: t.number,
	purchaserNameFirst: OptionalString,
	purchaserNameLast: OptionalString,
	purchaserEmail: OptionalString,
	recipientNameFirst: OptionalString,
	recipientNameLast: OptionalString,
	recipientEmail: OptionalString,
	addr1: OptionalString,
	addr2: OptionalString,
	city: OptionalString,
	state: OptionalString,
	zip: OptionalString,
	deliveryMethod: t.string,
	whoseAddress: OptionalString,
	whoseEmail: OptionalString
})

const resultValidator = t.type({success: t.boolean})

const path = "/member/gc-purchase"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})