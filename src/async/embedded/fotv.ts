import * as t from 'io-ts'
import APIWrapper from 'core/APIWrapper'
import { HttpMethod } from "core/HttpMethod"
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators'

export const logoImageValidator = t.type({
    imageID: t.number,
    logoImageID: t.number,
    title: t.string,
    displayOrder: t.number,
    imageType: t.number,
})

export const restrictionValidator = t.type({
    restrictionID: t.number,
    title: t.string,
    message: t.string,
    active: t.boolean,
    groupID: t.number,
    backgroundColor: t.string,
    imageID: OptionalNumber,
    textColor: t.string,
    fontWeight: OptionalString,
    displayOrder: t.number,
    isPriority: t.boolean
})

export const restrictionGroupValidator = t.type({
    groupID: t.number,
    title: t.string,
    displayOrder: t.number
})

export const restrictionConditionValidator = t.type({
    conditionID: t.number,
    restrictionID: t.number,
    conditionAction: OptionalNumber,
    conditionType: OptionalNumber,
    conditionInfo: OptionalString
})

export const imageValidator = t.type({
    imageID: t.number,
    version: t.number
})

export const singletonDataValidator = t.type({
    data_key: t.string,
    value: t.string
})

export const validator = t.type({
    sunset: t.string,
    restrictions: t.array(restrictionValidator),
    restrictionGroups: t.array(restrictionGroupValidator),
    restrictionConditions: t.array(restrictionConditionValidator),
    logoImages: t.array(logoImageValidator),
    images: t.array(imageValidator),
    singletonData: t.array(singletonDataValidator)
})

const path: string = "/fotv"

export type FOTVType = t.TypeOf<typeof validator>

export type RestrictionType = t.TypeOf<typeof restrictionValidator>

export type RestrictionGroupType = t.TypeOf<typeof restrictionGroupValidator>

export type LogoImageType = t.TypeOf<typeof logoImageValidator>

export const getWrapper = new APIWrapper({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator
})