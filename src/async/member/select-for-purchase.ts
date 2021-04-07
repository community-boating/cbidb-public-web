import * as t from 'io-ts';
import APIWrapper from '@core/APIWrapper';
import { HttpMethod } from "@core/HttpMethod";
import { OptionalNumber } from '@util/OptionalTypeValidators';

export const validator = t.type({
	memTypeId: t.number,
	requestedDiscountId: OptionalNumber
})

const resultValidator = t.type({
	paymentPlanAllowed: t.boolean,
	guestPrivsAuto: t.boolean,
	guestPrivsNA: t.boolean,
	damageWavierAuto: t.boolean,
})

const path = "/member/select-for-purchase"

export const postWrapper = new APIWrapper<typeof resultValidator, t.TypeOf<typeof validator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator,
	fixedParams: {}
})