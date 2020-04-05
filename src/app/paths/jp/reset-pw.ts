import {jpBasePath} from "./_base";

export const jpPathResetPW =  jpBasePath.appendPathSegment<{email: string, hash: string}>("/reset-pw/:email/:hash");