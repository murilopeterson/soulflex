export default class Util{
    constructor(){}
    static checkString(a, b) {
        if (typeof b !== "string" || b === "") return false;

        if (typeof a === "string") {
            return a.includes(b);
        }

        if (typeof a === "number" && !isNaN(a)) {
            return String(a).includes(b);
        }

        if (Array.isArray(a)) {
            return a.some(item => checkString(item, b));
        }

        if (typeof a === "object" && a !== null) {
            return Object.values(a).some(value => checkString(value, b));
        }

        return false;
    }

    static check_date(date){
        const [dia, mes, ano] = date.split("/");
        return `${ano}-${mes}-${dia}`;
    }
}