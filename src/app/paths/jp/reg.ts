import {jpBasePath} from "./_base";

export const jpPathReg = jpBasePath.appendPathSegment<{ personId: string }>("/reg/:personId");