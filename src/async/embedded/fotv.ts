import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalNumber, OptionalString } from 'util/OptionalTypeValidators';

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
    displayOrder: t.number
})

export const restrictionGroupValidator = t.type({
    groupID: t.number,
    title: t.string,
    displayOrder: t.number
})

export const imageValidator = t.type({
    imageID: t.number,
    version: t.number
});

export const validator = t.type({
    sunset: t.string,
    restrictions: t.array(restrictionValidator),
    restrictionGroups: t.array(restrictionGroupValidator),
    logoImages: t.array(logoImageValidator),
    images: t.array(imageValidator),
    activeProgramID: t.number
})

const path: string = "/fotv"

export type FOTVType = t.TypeOf<typeof validator>

export type LogoImageType = t.TypeOf<typeof logoImageValidator>;

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator,
    serverIndex: 1
})