import {jpBasePath} from "./_base";

export const jpPathRatings = jpBasePath.appendPathSegment<{ personId: string }>('/ratings/:personId');