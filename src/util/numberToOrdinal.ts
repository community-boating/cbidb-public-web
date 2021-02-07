/**
 * 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 => "4th", ... 26 -> "26th", ...
 * @param i 
 */
export const numberToOrdinal: (i: number) => string = i => {
	if (Number.isInteger(i) && i >= 0) {
		const digit = i % 10;
		const lastTwo = i % 100;
		if (digit == 1 && lastTwo != 11) {
			return i + "st";
		}
		if (digit == 2 && lastTwo != 12) {
			return i + "nd";
		}
		if (digit == 3 && lastTwo != 13) {
			return i + "rd";
		}
		return i + "th";
	} else {
		return null;
	}
}