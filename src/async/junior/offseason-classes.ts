import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";

export const validator = t.type({
	className: t.string,
	typeId: t.number,
	instanceId: t.number,
	price: t.number,
	timeRange: t.string,
	classDates: t.string,
	seeType: t.string,
	spotsLeft: t.number,
	signupCtThisJunior: t.number
})

const path = "/junior/offseason-classes"

export const getWrapper = (juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?juniorId=" + juniorId,
	type: HttpMethod.GET,
	resultValidator: validator
})
