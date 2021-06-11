import {apDonatePath} from "./donate"

export const apDonateEditPath = apDonatePath.appendPathSegment<{}>("/edit");