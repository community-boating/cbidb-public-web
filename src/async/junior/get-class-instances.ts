import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const validator = t.array(t.type({
	instanceId: t.number,
	className: t.string,
	firstDay: t.string,
	lastDay: t.string,
	classTime: t.string,
	notes: OptionalString,
	spotsLeft: t.string,
	action: t.string
}))


const path = "/junior/get-class-instances"

export const getWrapper = (typeId: number, juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + `?typeId=${typeId}&juniorId=${juniorId}`,
	type: HttpMethod.GET,
	resultValidator: validator
})