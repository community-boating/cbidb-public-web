import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString } from '../util/OptionalTypeValidators';
import { Option, some, none } from 'fp-ts/lib/Option';

export const validatorSingleRow = t.type({
	instanceId: t.number,
	className: t.string,
	firstDay: t.string,
	lastDay: t.string,
	classTime: t.string,
	notes: OptionalString,
	spotsLeft: t.string,
	action: t.string,
	typeId: t.number,
	startDatetimeRaw: t.string,
	endDatetimeRaw: t.string
})

export const validator = t.array(validatorSingleRow)

const path = "/class-instances-with-avail"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
	path: path,
	type: HttpMethod.GET,
	resultValidator: validator,
	jsconMap: {
		instanceId: "INSTANCE_ID",
		className: "CLASS_NAME",
		firstDay: "FIRST_DAY",
		lastDay: "LAST_DAY",
		classTime: "CLASS_TIME",
		notes: "NOTES",
		spotsLeft: "SPOTS_LEFT",
		action: "ACTION",
		typeId: "TYPE_ID",
		startDatetimeRaw: "START_DATETIME_RAW",
		endDatetimeRaw: "END_DATETIME_RAW"
	}
})