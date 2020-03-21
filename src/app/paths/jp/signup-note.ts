import jpPath from "./_base";

export default jpPath.appendPathSegment<{ personId: string, instanceId: string }>("/class-note/:personId/:instanceId");