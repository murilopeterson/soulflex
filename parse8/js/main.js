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

                const ref = item[1] ? Number(item[1]) : ''
                const obs = typeof data[current+1][0] === 'string' ? data[current+1][0] : ''

                obj[current] = {
                    info: item[0],
                    ref,obs,
                    items:[],
                    payment:[]
                }
                return
            }

            if(current){
                if( item.length === 5 && Number.isInteger(item[0])){
                    obj[current].items.push(item)
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

}

new App;

