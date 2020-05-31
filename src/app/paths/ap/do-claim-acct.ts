import { apBasePath } from "./_base";

export const apPathDoClaimAcct = apBasePath.appendPathSegment<{ email: string, personId: string, hash: string }>("/do-claim-acct/:email/:personId/:hash");