import {jpBasePath} from "./_base";

export const jpPathOffseason = jpBasePath.appendPathSegment<{ personId: string }>('/offseason/:personId');