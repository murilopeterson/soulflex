export default class Util{
    constructor(){}
    static checkString(a, b) {
        
        if (!b) return false;

        if (Array.isArray(b)) {
            return b.some(word => this.checkString(a, word));
        }

        if (typeof b !== "string") return false;

        if (typeof a === "string") {
            return a.toLowerCase().includes(b.toLowerCase());
        }

        if (typeof a === "number" && !isNaN(a)) {
            return String(a).includes(b);
        }

        if (Array.isArray(a)) {
            return a.some(item => this.checkString(item, b));
        }

        if (typeof a === "object" && a !== null) {
            return Object.values(a).some(value => this.checkString(value, b));
        }

        return false;
    }

    static check_date(date){
        const [dia, mes, ano] = date.split("/");
        return `${ano}-${mes}-${dia}`;
    }
}