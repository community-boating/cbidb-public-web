import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";

export const guidedSailInstanceValidator = t.type({
	startDatetime: t.string,
	endDatetime: t.string,
	instructorId: t.number,
	signupCt: t.number,
	maxSignups: t.number
})

export const guidedSailSlotRangeValidator = t.type({
    day: t.string,
    start: t.string,
    end: t.string
})

export const validator = t.type({
    instances: t.array(guidedSailInstanceValidator),
    ranges: t.array(guidedSailSlotRangeValidator)
})

export const teachGuidedSailSignupValidator = t.type({
    startDatetime: t.string,
    endDatetime: t.string
})

const path = "/ap/guided-sail-teach"

export const getGuidedSailInstancesAndSlots = new APIWrapper<typeof validator, {}, {}>({
	path,
	type: HttpMethod.GET,
    resultValidator: validator
})

export const signupTeachGuidedSail = new APIWrapper<typeof guidedSailInstanceValidator, t.TypeOf<typeof teachGuidedSailSignupValidator>, {}>({
	path,
	type: HttpMethod.POST,
	resultValidator: guidedSailInstanceValidator,
	fixedParams: {}
})

