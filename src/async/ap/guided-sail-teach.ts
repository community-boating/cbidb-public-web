import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { Moment } from 'moment';
import { DATETIME_FORMAT_API } from 'util/dateUtil';
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

export const guidedSailInstanceValidator = t.type({
	startDatetime: t.string,
	sessionLength: t.number,
	instanceId: t.number,
	signupCt: t.number,
	maxSignups: t.number
})

export const guidedSailDayValidator = t.type({
    day: t.string,
	slots: t.array(t.array(t.string))
})

export const validator = t.type({
    instances: t.array(guidedSailInstanceValidator),
})

export const teachGuidedSailSignupValidator = t.type({
	timeslot: t.string
})

const pathCurrentInstances = "/ap/get-guided-sail-instances"

const slotsValidator = t.array(guidedSailDayValidator)

const instancesValidator = t.array(guidedSailInstanceValidator)

const pathSlots = '/ap/get-guided-sail-time-slots'

export type GuidedSailSlotsType = t.TypeOf<typeof slotsValidator>

export const getGuidedSailSlots = (year: number, month: number) => new APIWrapper<typeof slotsValidator, {}, {}>({
	path: pathSlots + "?" + "forYear=" + year + "&forMonth=" + month,
	type: HttpMethod.GET,
    resultValidator: slotsValidator
})

export type GuidedSailInstancesType = t.TypeOf<typeof instancesValidator>

export const getCurrentGuidedSailInstances = new APIWrapper<typeof instancesValidator, {}, {}>({
	path: pathCurrentInstances,
	type: HttpMethod.GET,
    resultValidator: instancesValidator
})

const pathSignupTeachGuidedSail = '/ap/create-guided-sail-instance'

const teachResultValidator = t.type({
	instanceId: OptionalNumber,
	signupCt: OptionalNumber,
	errors: OptionalString
})

export const signupTeachGuidedSail = (timeslot: Moment) => new APIWrapper<typeof teachResultValidator, {}, {}>({
	path: pathSignupTeachGuidedSail + "?timeslot=" + timeslot.format(DATETIME_FORMAT_API),
	type: HttpMethod.POST,
	resultValidator: teachResultValidator,
	fixedParams: {}
})

const pathCancelTeachGuidedSail = '/ap/cancel-guided-sail-instance'

export const cancelTeachGuidedSail = (instanceId: number) => new APIWrapper<t.StringC, {}, {}>({
	path: pathCancelTeachGuidedSail + "?instanceId=" + instanceId,
	type: HttpMethod.POST,
	resultValidator: t.string,
	fixedParams: {}
})

