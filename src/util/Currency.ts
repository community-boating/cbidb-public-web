export default class Currency {
    private cents: number

    constructor(cents: number) {
        this.cents = Math.round(cents);
    }

    static cents(cents: number): Currency {
        return new Currency(cents);
    }

    static dollars(dollars: number): Currency {
        return new Currency(100 * dollars)
    }

    format(): string;
    format(skipCents: boolean): string;
    format(skipCents?: boolean): string {
        const self = this
        const dollars = Math.floor(this.cents/100)
        const cents = (function() {
            var raw = String(Math.round(self.cents % 100))
            while (raw.length < 2) raw += "0"
            return raw
        }())

        if (skipCents && this.cents % 100 == 0) return "$" + dollars
        else return "$" + dollars + "." + cents
    }
}