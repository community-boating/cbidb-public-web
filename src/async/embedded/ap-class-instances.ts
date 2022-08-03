import * as t from 'io-ts';
import APIWrapper from 'core/APIWrapper';
import { HttpMethod } from "core/HttpMethod";
import { OptionalString } from 'util/OptionalTypeValidators';

export const validator = t.array(t.type({
    instanceId: t.number,
    typeName: OptionalString,
    startDate: t.string,
    startTime: t.string,
    locationString: OptionalString,
    enrollees: t.number
}));

const path = "/ap-class-instances"

export const getWrapper = new APIWrapper({
    path,
    type: HttpMethod.GET,
    resultValidator: validator,
    jsconMap: {instanceId: "INSTANCE_ID", typeName: "TYPE_NAME", startDate: "START_DATE", startTime: "START_TIME", locationString: "LOCATION_STRING", enrollees: "ENROLLEES"}
})