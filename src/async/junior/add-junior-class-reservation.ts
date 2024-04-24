import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber } from 'util/OptionalTypeValidators';

export const validator = t.type({
	juniorFirstName: t.string,
	beginnerInstanceId: OptionalNumber,
	intermediate1InstanceId: OptionalNumber,
	intermediate2InstanceId: OptionalNumber
})

const result = t.type({
	personId: t.number
})

const path = "/junior/add-junior-class-reservation"

export const postWrapper = new APIWrapper({
	path,
	type: HttpMethod.POST,
	resultValidator: result,
	postBodyValidator: validator
})