import XLS from "./XLS.js";
import IDB from "./IDB.js";
import Util from "./Util.js";

class Reader{
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
            }

        })
    }
}

class App{

    constructor(){
        this.file = new Reader("file", this.onFileChange.bind(this))
        this.onFileChange()
    }

    onFileChange(data) {
        
        if (!data) return

        const obj   = []
        const title = data?.[0]?.[0] ?? ''
        const range = data?.[0]?.[1] ?? ''

        let current = null

        obj.push({title,range})

        if(title.includes("Relatório"))
            data.forEach((item, index) => {
           
                if(typeof item[0] == 'string' && item[0].includes("Pedido: ")){

                    current = index

                    const ref   = item[1] ? Number(item[1]) : ''
                    const obs   = typeof data[current+1][0] === 'string' ? data[current+1][0] : ''
                    const order = this.orderParse(item[0])

                    obj[current] = {
                        info: item[0],
                        order,
                        ref,obs,
                        items:[],
                        payment:[]
                    }
                    return
                }

                if(current){
                    if( item.length === 5 && Number.isInteger(item[0])){
                        obj[current].items.push(this.itemParse(item))
                        return
                    }

                    if( item.length === 4 && item[3].includes("Valor")){
                        obj[current].payment.push(item)
                        return
                    }
                }

            });

        console.log(obj)
        
    }
    
    orderParse(order){
        const values = [];

        const regex = /([\wÀ-ÿ\.\º]+)\s*:\s*([^:]*?)(?=\s+\w[\wÀ-ÿ\.\º]*\s*:|$)/g;

        let match;
        while (match = regex.exec(order.replace("Nº",'').trim())) {
            const value = match[2].trim();
            values.push(value === "" ? null : value);
        }
        
        const keys = ["op", "sale_date", "invoice_date", "nfe", "salesman", "client"];

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));

    }

    itemParse(item){
        const normalizedStr = item[1].replaceAll(".", "").replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        const type =    normalizedStr.slice(0, sizeIndex).trim()
                        .replace(/\s+/g, ' ')
                        .trim() || "";
        
        const cloth = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";
     
        
        return { id:item[0], type, size, cloth, price:item[2], qty:item[3]}
    }

    paymentParse(payment){
        const normalizedStr = payment[2].replaceAll(".", "").replace(/\s+/g, ' ').trim();
        return { total:payment[2], discount, method:payment[1]}
    }

}

new App;

