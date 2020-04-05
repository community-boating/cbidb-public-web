import {jpBasePath} from "./_base";

export const jpPathSignupNote = jpBasePath.appendPathSegment<{ personId: string, instanceId: string }>("/class-note/:personId/:instanceId");