import XLS from "./XLS.js";
import IDB from "./IDB.js";
import Util from "./Util.js";

class InputReader{
    constructor(input, callback){
        this.input = document.getElementById(input)
        this.callback = callback

        this.input.addEventListener('change', async (event) => {
            event.preventDefault()

            const xls = new XLS(event.target)
            try {
                const data = await xls.read()
                this.callback(data)
                
            } catch (error) {
                console.error('Erro ao ler arquivo:', error)
                this.callback(null)
            } finally {
                this.input.value = ''
            }
        })
    }
}

class FileHeader{
    constructor(data){
        this.title = data?.[0]?.row?.[0] ?? ''
    }

    contains(text) {
        return Util.checkString(this.title, text)
    }
}

class Row{
    constructor(input){
        this.data = input
    }
    

    isOrder(){
        return Util.checkString(this.data[0], "PEDIDO:")
    }
    
    isItem(){
        const isNumber = value => typeof value === "number" && !isNaN(value);
        return (isNumber(this.cells.first) && isNumber(this.cells.third))
    }

    parseKeyValue(text) {
        const result = {};

        // captura a chave e tudo até a próxima chave ou fim
        const regex = /([\wÀ-ÿ\.\º]+)\s*:\s*([^:]*?)(?=\s+\w[\wÀ-ÿ\.\º]*\s*:|$)/g;

        let match;
        while (match = regex.exec(text)) {
            const key = match[1].trim();
            let value = match[2].trim();

            // se não existe valor ou é só espaços
            if (value === "") value = null;

            result[key] = value;
        }

        return result;
    }

    parseOrder(){

        if(!this.isOrder)
            return 

        const [pt1, pt2] = this.splitByClient();
        const valuesPt1  = this.extractKeyValues(pt1);
        const valuesPt2  = this.extractKeyValues(pt2);

        const keys = ["pedido", "venda", "faturado", "vendedor", "cliente"];
        const values = [...valuesPt1, ...valuesPt2];

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));;
    }

    splitByClient(){
        const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
        const match = this.cells.first.match(regexSplit);

        if (!match) return [this.output, ""];

        const firstPart  = match[1].trim();
        const secondPart = match[2].trim();

        return [firstPart, secondPart];
    }

    extractKeyValues(string) {
        const regex = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
        const result = [];

        for (const match of string.matchAll(regex)) {
            const value = match[2].trim();
            result.push(value);
        }

        return result;
    }

    parseItem(){
        if(!this.isItem)
            return

        const [pt1, pt2, pt3] = this.splitDescription()

        const keys = ["tamanho", "modelo", "roupa"];
        const values = [pt1, pt2, pt3];
        
        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));;
        
    }

    splitDescription(){
        const normalizedStr = this.cells.second.replaceAll(".", "").replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        //const type = normalizedStr.slice(0, sizeIndex).trim().replaceAll(".", "").replace(/\s+/g, ' ').trim() || "";
        const type =    normalizedStr.slice(0, sizeIndex).trim()
                        .replace(/\s+/g, ' ')
                        .trim() || "";

        const material = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";
        
        return [size, type, material]
    }

    get product(){
        return {item:this.cells.second, qty: this.cells.third}
    }

    get order() {

        const result = {};
        const str = this.data[0].replace("Nº",'')

        const regex = /([\wÀ-ÿ\.\º]+)\s*:\s*([^:]*?)(?=\s+\w[\wÀ-ÿ\.\º]*\s*:|$)/g;

        let match;
        while (match = regex.exec(str)) {
            const key = match[1].trim();
            let value = match[2].trim();

            
            if (value === "") value = null;

            result[key] = value;
        }

        return result;
    }

    get salesman(){
        return this.parseOrder().vendedor
    }

    get sale_date(){
        return this.parseOrder().venda
    }

    get income_date(){
        return this.parseOrder().faturado
    }

    get client(){
        return this.parseOrder().cliente
    }

    get model(){
        //let model = this.parseItem().modelo

        let model = this.parseItem().modelo
                .replace("108 COURO BEGE", 'ZZZ')

                .replace("BOX BAU", 'BAU')
                .replace("GOLD LUXO", 'LUXO')
                .replace("BOX TATAME", 'TATAME')
                .replace("BOX EVOLUTION", 'TATAME EVOLUTION')
                .replace("BOX BICAMA", 'BICAMA')
                .replace("BOX DIAMANTE TATAME", 'TATAME DIAMANTE')
                .replace("GOLD PRIME", 'PRIME')
                .replace("PARTIDA", 'PARTIDO')
                .replace("CABECEIRA LISTRAS", 'LISTRAS')
                .replace("GOLD CASHMERE", 'CASHMERE')
                .replace("ANTIDERRAOANTE", 'ANTIDERRAPANTE')
                .replace("ANTIDERRPANTE", 'ANTIDERRAPANTE')
                .replace("UMA LISTRA", '1 LISTRA')
                .replace("C/", 'COM')

                .replace("BOX ",'')
                .replace("GRAN PARTIDO", 'BOX PARTIDO')
                .replace("GRAN",'')
                .replace("GOLD",'')
                .replace("LISTRAS",'')
                .replace("1 LISTRA",'')
                .replace("LISA",'')
                //.replace("BOX",'')
                .trim()
        
        let material = this.parseItem().roupa
                /* .replace("PP1", '')
                .replace("PP2", '')
                .replace("PP3", '')
                .replace("PP4", '')
                .replace("PP5", '')
                .replace("SP1", '')
                .replace("COURO", '')
                .replace("LINHO", '') */
                .replace("FACTOR", 'FACTO')
                .replace("FACTON", 'FACTO')
                .replace("BUCLE", 'BOUCLE')
                .replace("BUOCLE", 'BOUCLE')
                .replace("BOUCLE ALASKA", 'ALASKA')
                //.replace("BOUCLE", '')
                .replace("CHOCOLTE", 'CHOCOLATE')
                .trim()

        let [type, ...feature] = model.split(" ");
        const result = []
        Object.assign(result, { type, feature:feature[0], extra: feature.join(' ').split("DIAMANTE ")[1] || "" });
        //return [type, feature[0] || "", feature.join(' ').split("DIAMANTE ")[1] || ""]

        if(model.includes("ZZZ")) return null

        return ((model || "BOX") +" "+ this.parseItem().tamanho ).replace(/\s+/g, " ")
    }

    get observation() {
        return this.cells.second.replace(/^Obs:\s*/i, '').trim()
    }

    hasObservation(){
        return this.observation !== ''
    }


}

class App{

    constructor(){
        this.orders = []
        this.file = new InputReader("file", this.onFileChange.bind(this))
        this.onFileChange()
    }

    onFileChange(data) {
        if (!data) return
        
        const header = new FileHeader(data)

        if (header.contains("Relatório")) {
            this.handleReport(data)
        }
    }


    handleReport(data){

        const rows = data.slice(2).map(item => new Row(item.row))

        rows
            .filter(row => row.isOrder())
            .forEach(item => {
                console.log(item.order)
            }
        );

    }
   
}

new App

/*const db = new IDB('myDB', 'data', 'id');

// Save
await db.save({ id: 1, name: "Test" });

// Get
const item = await db.get(1);

// Get all
const items = await db.getAll(); 

// Delete
await db.delete(1);*/