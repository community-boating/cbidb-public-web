import * as Sentry from "@sentry/react"

// TODO: Figure out how to get this to actually send a stacktrace to sentry
export const assertUniqueKeys: <T extends any>(es: T[]) => T[] = es => {
	var keys: {[k: string]: true} = {};
	es.forEach(e => {
		const key = (e as any).key || "";
		if (undefined !== keys[key]) {
			try {
				const e = new Error ("Non unique react key " + key);
				Sentry.captureException(e);
				throw e;
			} catch (e) {
				// quietly eat it after throwing to sentry
			}
		}
		keys[key] = true;
	});	
	return es;
}