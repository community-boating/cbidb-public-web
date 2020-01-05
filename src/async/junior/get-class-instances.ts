import * as t from 'io-ts';
import APIWrapper from '../../core/APIWrapper';
import { HttpMethod } from "../../core/HttpMethod";
import { OptionalString } from '../../util/OptionalTypeValidators';

export const instanceValidator = t.type({
	instanceId: t.number,
	className: t.string,
	firstDay: t.string,
	lastDay: t.string,
	classTime: t.string,
	notes: OptionalString,
	spotsLeft: t.string,
	action: t.string,
	week: t.number
})

export const getClassInstancesValidator = t.type({
	typeId: t.number,
	typeName: t.string,
	sessionLength: t.number,
	sessionCt: t.number,
	instances: t.array(instanceValidator)
})

export type InstanceInfo = t.TypeOf<typeof instanceValidator>;

const path = "/junior/get-class-instances"

export const getWrapper = (typeId: number, juniorId: number) => new APIWrapper<typeof getClassInstancesValidator, {}, {}>({
	path: path + `?typeId=${typeId}&juniorId=${juniorId}`,
	type: HttpMethod.GET,
	resultValidator: getClassInstancesValidator
})