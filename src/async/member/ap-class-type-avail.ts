import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const availabilityValidator = t.type({
	typeId: t.number,
	typeName: t.string,
	availabilityFlag: t.number,
	displayOrder: t.number,
	noSignup: t.boolean,
	seeTypeError: OptionalString,
	description: OptionalString
});

export const validator = t.type({
	types: t.array(availabilityValidator),
	voucherCt: t.number
})

export enum AvailabilityFlag {
	RECOMMENDED = 1,
	REVIEW = 2,
	INELIGIBLE = 3
}

const path = "/member/ap-class-type-avail"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator
})