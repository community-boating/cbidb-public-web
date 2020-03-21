import jpPath from "./_base";

export default jpPath.appendPathSegment<{ personId: string, typeId: string }>("/class-time/:personId/:typeId");