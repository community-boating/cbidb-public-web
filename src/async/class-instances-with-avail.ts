import * as t from 'io-ts';
import APIWrapper from '../core/APIWrapper';
import { HttpMethod } from "../core/HttpMethod";
import { OptionalString } from '../util/OptionalTypeValidators';
import { Option, some, none } from 'fp-ts/lib/Option';

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
		action: "ACTION"
	}
})

// input: Tuesday  <br >  08/06/2019
// scrape Tuesday and 08/06/2019
export const scrapeClassDayAndDate: (raw: string) => Option<{day: string, date: string}> = raw => {
	const regex = /([\w]+)[\s]*(?:<.*>)?[\s]*([0-9\/]+)/;
	const result = regex.exec(raw)
	if (result && result[1] && result[2]) {
		return some({
			day: result[1],
			date: result[2]
		});
	} else return none;
}