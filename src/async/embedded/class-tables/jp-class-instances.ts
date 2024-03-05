import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.array(t.type({
    sectionId: t.number,
    sectionName: OptionalString,
    instanceId: t.number,
    typeName: t.string,
    startDate: t.string,
    startTime: t.string,
    instructorNameFirst: OptionalString,
    instructorNameLast: OptionalString,
    locationName: OptionalString,
    enrollees: t.number
}));

const path: string = "/jp-class-sections"

export const getWrapper = new APIWrapper<typeof validator, {}, {}>({
    path: path,
    type: HttpMethod.GET,
    resultValidator: validator,
    jsconMap: { sectionId: "SECTION_ID", sectionName: "SECTION_NAME", instanceId: "INSTANCE_ID", typeName: "TYPE_NAME", startDate: "START_DATE", startTime: "START_TIME", instructorNameFirst: "INSTRUCTOR_NAME_FIRST", instructorNameLast: "INSTRUCTOR_NAME_LAST", locationName: "LOCATION_NAME", enrollees: "ENROLLEES"},
})