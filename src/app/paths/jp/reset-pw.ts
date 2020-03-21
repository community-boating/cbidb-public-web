import jpPath from "./_base";

export default jpPath.appendPathSegment<{email: string, hash: string}>("/reset-pw/:email/:hash");