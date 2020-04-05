import {jpBasePath} from "./_base";

export const jpPathClass = jpBasePath.appendPathSegment<{ personId: string }>("/class/:personId");