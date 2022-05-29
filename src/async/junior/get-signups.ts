import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

const enrollmentAPIResultValidator = t.type({
	instanceId: t.number,
	typeId: t.number,
	className: t.string,
	week: t.string,
	dateString: t.string,
	timeString: t.string
});

export type EnrollmentAPIResult = t.TypeOf<typeof enrollmentAPIResultValidator>;

const waitListTopAPIResultValidator = t.type({
	instanceId: t.number,
	typeId: t.number,
	className: t.string,
	week: t.string,
	dateString: t.string,
	timeString: t.string,
	offerExpiresString: t.string,
	offerExpDatetime: t.string,
	nowDateTime: t.string
});

export type WaitListTopAPIResult = t.TypeOf<typeof waitListTopAPIResultValidator>;

const waitListAPIResultValidator = t.type({
	instanceId: t.number,
	typeId: t.number,
	className: t.string,
	week: t.string,
	dateString: t.string,
	timeString: t.string,
	wlPosition: t.number
});

export type WaitListAPIResult = t.TypeOf<typeof waitListAPIResultValidator>;

export const validator = t.type({
	juniorId: t.number,
	enrollments: t.array(enrollmentAPIResultValidator),
	waitListTops: t.array(waitListTopAPIResultValidator),
	waitLists: t.array(waitListAPIResultValidator)
})

export type GetSignupsAPIResult = t.TypeOf<typeof validator>;


const path = "/junior/get-signups"

export const getWrapper = (juniorId: number) => new APIWrapper<typeof validator, {}, {}>({
	path: path + "?juniorId=" + juniorId,
	type: HttpMethod.GET,
	resultValidator: validator
})
