import XLS from "./XLS.js";
import IDB from "./IDB.js";
import Util from "./Util.js";

const CLIENTS_DATA = [
    {
        "id": 1,
        "client": "SUPER SONO RA",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 2,
        "client": "SUPER SONO MR",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 3,
        "client": "DURMA BEM MANGALO",
        "route": "N25",
        "ranting": ""
    },
    {
        "id": 4,
        "client": "VULER COMERCIO DE COLCHOES LTDA",
        "route": "E30",
        "ranting": ""
    },
    {
        "id": 5,
        "client": "COLCHOES E COMPLEMENTOS",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 6,
        "client": "BOA NOITE COLCHOES",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 7,
        "client": "CHIMANGO DISTRIBUIDORA DE COLCHOES LTDA",
        "route": "S25",
        "ranting": ""
    },
    {
        "id": 8,
        "client": "ACONCHEGO COLCHOES",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 9,
        "client": "CENARIO DO SONO",
        "route": "E35",
        "ranting": ""
    },
    {
        "id": 10,
        "client": "SO COLCHOES BOLIMAR",
        "route": "E55",
        "ranting": ""
    },
    {
        "id": 11,
        "client": "ESTACAO DO SONO CENTRO",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 12,
        "client": "SIMONS RIO VERDE",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 13,
        "client": "EMPORIO DA CRIS",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 14,
        "client": "PARAISO COLCHOES",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 15,
        "client": "FC FERREIRA JACOB- DISTRIBUIDORA DE COLCHOES BURITI",
        "route": "S25",
        "ranting": ""
    },
    {
        "id": 16,
        "client": "CASA CRIS COLCHOES E ACESSORIOS LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 17,
        "client": "REAL COLCHOES LTDA",
        "route": "E30",
        "ranting": ""
    },
    {
        "id": 18,
        "client": "ORTOSONO QUIRINOPOLIS",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 19,
        "client": "TRINDADE COLCHOES",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 20,
        "client": "IG COMERCIO DE COLCHOES LTDA",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 21,
        "client": "RODRIGUES & CALACA LTDA",
        "route": "E35",
        "ranting": ""
    },
    {
        "id": 22,
        "client": "TELMA BABY",
        "route": "NE25",
        "ranting": ""
    },
    {
        "id": 23,
        "client": "SONOBOM LUA NOVA",
        "route": "S10",
        "ranting": ""
    },
    {
        "id": 24,
        "client": "EDILSON RESENDE FILHO",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 25,
        "client": "LEMA REPRESENTAÇOES",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 26,
        "client": "BELLUS COLCHOES",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 27,
        "client": "CHIMANGO 85",
        "route": "S25",
        "ranting": ""
    },
    {
        "id": 28,
        "client": "LIH HOPP COLCHOES LTDA",
        "route": "E30",
        "ranting": ""
    },
    {
        "id": 29,
        "client": "CONFORTT COLCHOES - EDUARDO",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 30,
        "client": "ATUAL COLCHOES",
        "route": "E25",
        "ranting": ""
    },
    {
        "id": 31,
        "client": "ORTOBOM",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 32,
        "client": "A PIONEIRA COLCHOES LTDA",
        "route": "E25",
        "ranting": ""
    },
    {
        "id": 33,
        "client": "WALTER PEREIRA PINTO",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 34,
        "client": "OUTLET COLCHOES E ACESSORIOS LTDA",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 35,
        "client": "GVM COMERCIO DE COLCHOES LTDA",
        "route": "E30",
        "ranting": ""
    },
    {
        "id": 36,
        "client": "ARMAZEM COLCHÕES",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 37,
        "client": "REALEZA COLCHOES LTDA",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 38,
        "client": "A EXCLUSIVA COLCHOES LTDA",
        "route": "SE20",
        "ranting": ""
    },
    {
        "id": 39,
        "client": "SONHAR COLCHOES LTDA",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 40,
        "client": "RV",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 41,
        "client": "CONFORTT COLCHÕES - JOSE ANTONIO",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 42,
        "client": "VIP INTERIORES",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 43,
        "client": "LUX COLCHOES LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 44,
        "client": "BONS SONHOS COLCHOES E COMPLEMENTOS LTDA",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 45,
        "client": "ELY COLCHOES",
        "route": "S10",
        "ranting": ""
    },
    {
        "id": 46,
        "client": "MARTINS DIAS E SILVA LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 47,
        "client": "COLCHOES E SONHOS - COMERCIO DE COLCHOES LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 48,
        "client": "BOM SONO LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 49,
        "client": "SONHARE LC MOVEIS E ELETRODOMESTICOS LTDA",
        "route": "NE30",
        "ranting": ""
    },
    {
        "id": 51,
        "client": "ESTACAO DO SONO T-63",
        "route": "E15",
        "ranting": ""
    },
    {
        "id": 52,
        "client": "ALVORADA COLCHOES E MOVEIS LTDA",
        "route": "N10",
        "ranting": ""
    },
    {
        "id": 53,
        "client": "SONO&CIA",
        "route": "S20",
        "ranting": ""
    },
    {
        "id": 54,
        "client": "SUPER COLCHOES MG",
        "route": "E25",
        "ranting": ""
    },
    {
        "id": 55,
        "client": "TR COLCHOES E DECORACOES LTDA",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 56,
        "client": "IMPERADOR COLCHOES E ESTOFADOS LTDA",
        "route": "N15",
        "ranting": ""
    },
    {
        "id": 57,
        "client": "PERFECT NIGHT COMERCIO VAREJISTA LTDA",
        "route": "E30",
        "ranting": ""
    },
    {
        "id": 58,
        "client": "VIVA MAIS",
        "route": "ZZ",
        "ranting": ""
    },
    {
        "id": 59,
        "client": "CONFORT SONO RIO VERDE",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 60,
        "client": "EXPRESS MADEIRAS",
        "route": "FF",
        "ranting": ""
    },
    {
        "id": 61,
        "client": "SLEEP LOVE",
        "route": "NE30",
        "ranting": ""
    }
]

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
        const orders = []
        const title = data?.[0]?.[0] ?? ''
        const range = data?.[0]?.[1] ?? ''

        let current = null

        obj.push({title,range})

        if(title.includes("Relatório"))
            data.forEach((item, index) => {
           
                if(typeof item[0] == 'string' && item[0].includes("Pedido: ")){

                    

                    const ref   = item[1] ? Number(item[1]) : ''
                    const obs   = typeof data[index+1][0] === 'string' ? data[index+1][0] : ''
                    const order = this.orderParse(item[0])

                    const client = CLIENTS_DATA.findIndex(item => item.client === order.client);
                    const route = CLIENTS_DATA[client] ? CLIENTS_DATA[client].route : ""

                    current = order.op

                    obj[order.op] = {
                        info: item[0],
                        order,
                        client:order.client,
                        sale_date:order.sale_date,
                        ref,obs,
                        deadline: "",
                        route,
                        items:[],
                        payment:[]
                    }
                    return
                }

                if(current){
                    if( item.length === 5 && Number.isInteger(item[0])){
                        let quee_time = 7
                        
                        const specials  = ["DIAMANTE","BAU", "BICAMA"]
                        const extra     = ["ELETRONICO"]

                        if(specials.some(p => item[1].includes(p))){
                            quee_time = 14
                        }
                        if(extra.some(p => item[1].includes(p))){
                            quee_time = 21
                        }

                        if(obj[current].deadline == "" || quee_time != 7){
                            obj[current].deadline = this.check_deadline(obj[current].sale_date,quee_time).deadline;
                        
                        }

                        let itemtp = this.itemParse(item)

                        let modelo = itemtp.model
                                        .replace('BOX', ' ')
                                        .replace('BAU', ' ')
                                        .replace('CASHEMERE', ' ')
                                        .replace('GOLD PRIME', 'PRIME')
                                        //.replace('DIAMANTE', ' ')
                                        .replace('ANTIDERRAPANTE', ' ')
                                        .replace('BICAMA', ' ')
                                        .replace('TATAME', ' ')
                                        .replace('PRATIC', ' ')
                                        .replace('LUXO', ' ')
                                        .replace('EVOLUTION', ' ')
                        let cat = itemtp.cat
                                        .replace('SOUL', '')
                                        .replace('ELETRONICO', '')
                                        .replace('PRIME', 'BOX')
                                        .replace('DIAMANTE', 'BOX')

                        if(cat == "CASHEMERE"){
                            modelo = cat
                            cat = 'BOX'
                        }
                            

                        for(let i = 1; i <= item[3]; i++){
                            const row = {
                                op: current,
                                venda:obj[current].sale_date,
                                prazo:obj[current].deadline,
                                loja:obj[current].client,
                                item:item[1],
                                tipo:cat,
                                modelo,
                                tamanho:itemtp.size,
                                roupa:itemtp.cloth,
                                quantidade:item[3],
                                rota:obj[current].route,
                                status:"",
                                produtor:"",
                                entrega:"",
                                observacao: obj[current].obs
                            }
                            //console.log(row)
                            orders.push(row)
                        }
                        
                        obj[current].items.push(this.itemParse(item))
                        return
                    }

                    /* if( item.length === 4 && item[3] && item[3].includes("Valor")){
                        obj[current].payment.push(item)
                        return
                    } */
                }

            });

            const producers = ['Francisco', 'Dionato', 'Jeremias', 'Daniel', 'Andre']
            //const newdata = this.distribute(orders, producers)
            //const summary = this.summary(newdata)

            this.genTable(orders, "app")
            //console.log(this.distribute(orders, producers))
            //for(const order in orders){
                //this.genTable(this.distribute(orders, producers), "app")
            //}
        
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


        let newmodel = type.replace("108 COURO BEGE", 'ZZZ')
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
        .trim()

        
        let parts = 1
        let headboard = 0
        let lid = 0

        const pt = size.split("X")

        const cond = ["BICAMA", "BAU", "TATAME"]

        if(pt[0] > 138 || type.includes("PARTID") ){
            parts++
            if(type.includes("BAU") ){
                lid++
            }
        }

        if(type.includes("DIAMANTE")){
            headboard++
        }

        if(pt[0] > 138 && type.includes("SEM CABECEIRA")){
            headboard--
        }
        
        /* type = type.split(" ");
        let feature = type.slice(1).join(" ")
        type = type[0]

        let model = {type: type, size: size, feature: feature, qty: item.row[2]} */

        let newItem =  {
            id: item[0],
            nmodel: (newmodel || "BOX"),
            model: type,
            //size: `${pt[0]}x${pt[1]}`,
            size: size,
            height: pt[2] ?? "",
            //feature: feature,
            parts: parts,
            cloth: cloth,
            headboard:headboard,
            lid:lid,
            qty: item[2]
        };
     
        
        return { id:item[0], type, size, cloth, price:item[2], qty:item[3], cat:newItem.nmodel, model:newItem.model }
    }

    genTable(data, containerId) {

        const dataArray = Array.isArray(data) ? data : [data];

        if (dataArray.length === 0) return;

        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML += '</br>';

        const headers = Object.keys(dataArray[0]);

        const table = document.createElement('table');
        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText.toUpperCase();
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();

        dataArray.forEach(obj => {
            const row = tbody.insertRow();
            
            headers.forEach(key => {
                const cell = row.insertCell();
                cell.textContent = obj[key];
            });
        });

        container.appendChild(table);
    }

    check_deadline(entry, quee_time){
        
        const [d, m, y] = entry.split("/").map(Number);
        const fullYear = y < 100 ? 2000 + y : y;
        
        let workingDays = 0;
        let deadline = new Date(fullYear, m - 1, d);

        while (workingDays < quee_time) {
            deadline.setDate(deadline.getDate() + 1);
            
            if (this.check_holiday(deadline)) {
                workingDays++;
            }
        }

        const diffInMs   = new Date(deadline) - new Date()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

        return {count:Math.round(diffInDays),deadline: deadline.toLocaleDateString()};
    }

    check_holiday(date){

        const weekday = date.getDay();
        const formatedDate = date.toISOString().slice(5, 10);
        const holidays = [
                        "01-01","03-04",
                        "04-18","04-21",
                        "05-01","05-24",
                        "06-19","07-26",
                        "09-07","10-12",
                        "10-24","10-28",
                        "11-02","11-15",
                        "11-20","12-25",
                        ,"12-22","12-23","12-24","12-26","12-29","12-30","12-31","01-02"
                    ];
        return weekday !== 0 && weekday !== 6 && !holidays.includes(formatedDate);
    }

    distribute(pedidos, produtores) {
        const resultado = [];
        const grupos = {};

        // Agrupar por tipo + tamanho
        pedidos.forEach(p => {
            const chave = `${p.tipo}_${p.tamanho}`;
            if (!grupos[chave]) grupos[chave] = [];
            grupos[chave].push(p);
        });

        // Para cada grupo (tipo+tamanho), distribuir igualmente
        Object.values(grupos).forEach(grupo => {

            let indiceProdutor = 0;

            grupo.forEach(pedido => {

                for (let i = 0; i < pedido.quantidade; i++) {

                    resultado.push({
                        ...pedido,
                        produtor: produtores[indiceProdutor]
                    });

                    indiceProdutor++;
                    if (indiceProdutor >= produtores.length) {
                        indiceProdutor = 0;
                    }
                }
            });
        });

        return resultado;
    }

    summary(assignments) {
        const summary = {};
        assignments.forEach(a => {
            const p = a.producer ?? 'UNASSIGNED';
            summary[p] = summary[p] || {};
            const key = `${a.tipo ?? a.type}_${a.tamanho ?? a.size}`;
            summary[p][key] = (summary[p][key] || 0) + (Number(a.quantity) || 1);
        });
        return summary;
    }

}

new App;

