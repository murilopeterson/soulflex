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

    static get alphabet(){
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    }

    static encode(numInput) {
        const base = this.alphabet.length;
        let num = parseInt(numInput);
        let result = "";

        for (let i = 0; i < 2; i++) {
            let remainder = num % base;
            result = this.alphabet[remainder] + result;
            num = Math.floor(num / base);
        }
        return result;
    }

    static decode(strInput) {
        const base = this.alphabet.length;
        let str = String(strInput);
        let num = 0;

        for (let i = 0; i < str.length; i++) {
            let char = str[i];
            let charIndex = this.alphabet.indexOf(char);
            num = num * base + charIndex;
        }
        return num;
    }
}