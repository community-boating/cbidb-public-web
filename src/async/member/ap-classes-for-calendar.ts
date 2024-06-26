import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

const sessionValidator = t.type({
	sessionId: t.number,
	instanceId: t.number,
	sessionDatetime: t.string,
	sessionLength: t.number
})

export const instanceValidator = t.type({
	instanceId: t.number,
	typeId: t.number,
	typeName: t.string,
	sessions: t.array(sessionValidator),
	signupType: OptionalString,
	waitlistResult: OptionalString,
	seeInstanceError: OptionalString,
	spotsLeft: t.number,
	price: t.number,
	instructorId: OptionalNumber
})

export const instancesValidator = t.array(instanceValidator)

const path = "/member/ap-classes-for-calendar"

export const getWrapper = new APIWrapper<typeof instancesValidator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: instancesValidator
})