import {jpBasePath} from "./_base";

export const jpPathReserveNotes = jpBasePath.appendPathSegment<{ personId: string }>('/reserve-notes/:personId');