import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.array(t.type({
	juniorFirstName: t.string,
	instanceId: t.number
}))

const path = "/junior/get-junior-class-reservations"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path,
	type: HttpMethod.GET,
	resultValidator: validator
})