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
        return Util.checkString(this.data[0],"PEDIDO:") && Util.checkString(this.data[0],"VENDA:")
    }

    isItem(){
        return this.data.length === 5 && Number.isInteger(this.data[0])
    }

    isPayment(){
        return this.data.length === 4 && Util.checkString(this.data[3],"VALOR")
    }

    isPaid(){
        return this.orderParse().income != null
    }

    isObs(){
        return this.data
    }
    
    orderParse(){

        const values = [];

        const regex = /([\wÀ-ÿ\.\º]+)\s*:\s*([^:]*?)(?=\s+\w[\wÀ-ÿ\.\º]*\s*:|$)/g;

        let match;
        while (match = regex.exec(this.data[0].replace("Nº",'').trim())) {
            const value = match[2].trim();
            values.push(value === "" ? null : value);
        }
        
        const keys = ["op", "sale", "income", "nfe", "vendor", "client"];

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));

    }

    itemParse(){
        const normalizedStr = this.data[1].replaceAll(".", "").replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        const type =    normalizedStr.slice(0, sizeIndex).trim()
                        .replace(/\s+/g, ' ')
                        .trim() || "";
        
        const cloth = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";
     
        
        return { id:this.data[0], type, size, cloth, price:this.data[2], qty:this.data[3]}
    }

    get order(){
        return Number(this.orderParse().op)
    }

    get sale(){
        return this.orderParse().sale //date
    }

    get income(){
        return this.orderParse().income //date
    }

    get nfe(){
        return Number(this.orderParse().nfe)
    }

    get vendor(){
        return this.orderParse().vendor
    }

    get client(){
        return this.orderParse().client
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
        const obj = []
        let current = null

        const rows = data.slice(2).map(item => new Row(item.row))

        rows
            //.filter(row => row.isPaid())
            .forEach((row, index, rows) => {
                if(row.isOrder()){
                    
                    let obs = typeof rows[index+1].data[0] === "string" ? rows[index+1].data[0] : null
                    let ref = row.data[1] ? Number(row.data[1]) : null

                    current = row.order
                    
                    obj[current] = {
                        sale:   row.sale,
                        income: row.income,
                        nfe:    row.nfe,
                        vendor: row.vendor,
                        client: row.client,
                        obs,
                        ref,
                        items:  [],
                        payment:[]

                    }
                    return

                }
                
                if(current && row.isItem()){
                    obj[current].items.push(row.itemParse())
                    return
                }

                if(row.isPayment())
                    obj[current].payment.push(row.data)
                
            }
        );

        console.log(obj)

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