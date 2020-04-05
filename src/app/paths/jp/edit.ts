import {jpBasePath} from "./_base";

export const jpPathEdit = jpBasePath.appendPathSegment<{ personId: string }>("/edit/:personId");