import {jpBasePath} from "./_base";

export const jpPathClassTime = jpBasePath.appendPathSegment<{ personId: string, typeId: string }>("/class-time/:personId/:typeId");