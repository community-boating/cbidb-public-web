import {apBasePath} from "./_base";

export const apPathResetPW =  apBasePath.appendPathSegment<{email: string, hash: string}>("/reset-pw/:email/:hash");