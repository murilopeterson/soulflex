export default class Util{
    constructor(){}

    static convertDate(input) {
        const date = this.normalizeToDate(input);
        
        if (!date || isNaN(date.getTime())) {
            return { excel: 0, string: '', dateJS: null };
        }

        // 1. Cálculo do número Serial do Excel (Mantendo a lógica original)
        // Usamos 86400000 ms (1 dia)
        const excelEpoch = new Date(1899, 11, 30);
        const excel = Math.floor((date - excelEpoch) / 86400000);
        
        // 2. Formatação da String
        // IMPORTANTE: Se 'normalizeToDate' retorna uma data local, 
        // use os métodos locais, não os UTC, para evitar saltos de fuso horário.
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const string = `${day}/${month}/${year}`;

        return { excel, string, date };
    }

    static normalizeToDate(input) {
        if (input instanceof Date) return input;

        if (typeof input === 'number') {
            // Converte serial do Excel para data JS
            return new Date((input - 25569) * 86400000);
        }

        if (typeof input === 'string') {
            // Se a string contiver a data abreviada, o parseStringDate resolve
            return this.parseStringDate(input);
        }

        return null;
    }

    static parseStringDate(dateStr) {
        // Limpa espaços e divide por / ou -
        const parts = dateStr.trim().split(/[\/\-]/);
        
        if (parts.length !== 3) return null;

        let day   = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let year  = parseInt(parts[2], 10);

        // Lógica de Correção: se o ano tiver 2 dígitos (ex: 25)
        // Consideramos que valores abaixo de 80 são 20xx e acima de 80 são 19xx
        if (year < 100) {
            year += (year < 80) ? 2000 : 1900;
        }

        // Criamos a data (Mês no JS é 0-11)
        const date = new Date(year, month - 1, day);

        // Validação: evita que 31/02 vire 03/03 automaticamente
        if (date.getFullYear() !== year || date.getMonth() !== month - 1) {
            return null;
        }

        return date;
    }

    static dateFromExcel(serial) {
        if (!serial || isNaN(serial)) return '';

        const date = new Date((serial - 25569) * 86400000);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');

        return `${day}/${month}/${date.getUTCFullYear()}`;
    }

    static get alphabet(){
        return "AZBYCXDWEVFUGTHSIRJQKPLOMN19375"
    }

    static encode(numInput, qty = 1) {
        const base = this.alphabet.length;
        let num = parseInt(numInput);
        let result = "";

        for (let i = 0; i < qty; i++) {
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