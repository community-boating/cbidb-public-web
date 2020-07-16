import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.array(t.type({
	typeId: t.number,
	typeName: t.string,
	availabilityFlag: t.number,
	displayOrder: t.number,
	noSignup: t.boolean,
	seeTypeError: OptionalString,
	description: t.string
}))

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