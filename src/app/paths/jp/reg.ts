import jpPath from "./_base";

export default jpPath.appendPathSegment<{ personId: string }>("/reg/:personId");