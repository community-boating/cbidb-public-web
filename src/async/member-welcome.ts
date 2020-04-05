import * as t from 'io-ts';
import APIWrapper, { ServerParams } from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString, OptionalNumber } from '../util/OptionalTypeValidators';

export const validator = t.type({
	parentPersonId: t.number,
	orderId: t.number,
	parentFirstName: t.string,
	parentLastName: t.string,
	userName: t.string,
	jpPrice: OptionalNumber,
	jpOffseasonPrice: OptionalNumber,
	children: t.array(t.type({
		personId: t.number,
		nameFirst: OptionalString,
		nameLast: OptionalString,
		status: OptionalString,
		actions: OptionalString,
		ratings: OptionalString
	})),
	serverTime: t.string,
	season: t.number,
	canCheckout: t.boolean
})

type Result = t.TypeOf<typeof validator>

const path = "/member-welcome"

export const apiw = new APIWrapper({
	path,
	type: HttpMethod.GET,
	resultValidator: validator,
})