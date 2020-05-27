export const assertUniqueKeys: <T extends any>(es: T[]) => T[] = es => {
	var keys: {[k: string]: true} = {};
	es.forEach(e => {
		const key = e.key || "";
		if (undefined !== keys[key]) {
			try {
				throw new Error ("Non unique react key " + key);				
			} catch (e) {

			}
		}
		keys[key] = true;
	});	
	return es;
}