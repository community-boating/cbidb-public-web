import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const signupValidator = t.type({
	juniorPersonId: t.number,
	juniorFirstName: t.string,
	instanceId: t.number,
	signupDatetime: t.string,
	expirationDateTime: t.string,
	minutesRemaining: t.number,
	signupNote: OptionalString
})

export const validator = t.type({
	instances: t.array(signupValidator),
	noSignups: t.array(t.string)
})

const path = "/junior/get-junior-class-reservations"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path,
	type: HttpMethod.GET,
	resultValidator: validator
})