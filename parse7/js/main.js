import XLS from "./XLS.js";
import DB from "./IDB.js";
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


class App{
    constructor(){
        this.data       = null
        this.orders     = []
        //this.list   = new OrderList()

        document.getElementById('file').addEventListener('change', async function (event) {

            const xls = new XLS(event.target);
            try {
                await xls.read();
                this.data = xls.getData();
                this.init();
            } catch (error) {
                console.error('Error reading file:', error);
            }

        }.bind(this));

    }

    init(){
        
        if(this.data){
            if(Util.checkString(this.get_title(),"RELAÇÃO")){
                this.set_obs()
            }

            if(Util.checkString(this.get_title(),"Relatório")){
                this.set_report()
            }
        }        
     
    }

    get_title(){
        return this.data.slice(0, 1)[0].row[0]
    }

    set_obs(){

        const data = this.data.slice(2);

        data.forEach(item => {

            const row = item.row

            if (Util.checkString(row[0], "PEDIDO")) {
                if(row[1].replace('Obs: ', '').trim() !== ''){
                   this.orders.push(row[1].replace('Obs: ', '').trim())
                }
            }
        })

    }

    set_report(){
        
        const orders  = []
        const items   = []
        const clients = []

        let current   = null
        let client_id = null 

        let next_id   = 1

        this.data.forEach(item => {

               

            const row = item.row

            if (Util.checkString(row[0], "Pedido")){
                const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
                const match = row[0].match(regexSplit);
                
                const pt1 = match[1].trim();
                const pt2 = match[2].trim();

                const regexKeyValue = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
                const result = [];
                
                const matchesPt1 = pt1.matchAll(regexKeyValue);
                for (const match of matchesPt1) {
                    result.push(match[2].trim());
                }

                const matchesPt2 = pt2.matchAll(regexKeyValue);
                for (const match of matchesPt2) {
                    result.push(match[2].trim());
                }

                const existing_pair = CLIENTS_DATA.find(pair => pair.client === result[4]);
                let route = ""
                if (existing_pair) {
                    client_id = existing_pair.id
                    route = existing_pair.route
                } else {
                    client_id = next_id;
                    const set = {
                        id: next_id,
                        client: result[4],
                        route: "",
                        ranting: ""
                    }

                    clients.push(set);
                    next_id++;
                }


                const order = {
                    op:     Number(result[0]),
                    sale:   result[1],
                    deadline: "",
                    //count: datecheck.count,
                    //income: result[2],
                    //seller: result[3],
                    client: client_id,
                    route: route
                }

                current = order.op
                orders.push(order)

            }
            else{
                if(current){
                    const normalizedStr = row[1].replace(/\s+/g, ' ').trim();

                    const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
                    const sizeMatch = normalizedStr.match(sizeRegx);
                    const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

                    const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

                    const model = normalizedStr.slice(0, sizeIndex).trim().replace(/\s+/g, ' ').trim() || "";

                    const cloth = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

                    let quee_time = 7

                    const specials  = ["DIAMANTE","BAU", "BICAMA"]
                    const extra     = ["ELETRONICO"]

                    if(specials.some(p => model.includes(p))){
                        quee_time = 14
                    }
                    if(extra.some(p => model.includes(p))){
                        quee_time = 21
                    }

                    let index = orders.findIndex(order => order.op === current);
                    if(orders[index].deadline == "" || quee_time != 7){
                        
                        if (index !== -1) {
                            orders[index].deadline = this.check_deadline(Util.check_date(orders[index].sale),quee_time).deadline;
                        }
                    }
                        
                    const item = {
                        op:    current,
                        id:    row[0],
                        model: model,
                        size:  size,
                        cloth: cloth,
                        //item: row[1],
                        qty:   row[2]
                    }
                    items.push(item)
                }              
            }

        });

        const by_route = orders.reduce((acc, item) => {
            const data = item.route;

            acc[data] = acc[data] || [];
            acc[data].push(item);
            return acc;
        }, {});

        const groups = [];
        let currentGroup = [];
        let currentSum = 0;

        for (const item of items) {
            if (currentSum + item.qty > 14) {
                groups.push(currentGroup);
                currentGroup = [];
                currentSum = 0;
            }

            currentGroup.push(item);
            currentSum += item.qty;
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        console.log(groups)

        const by_op = items.reduce((acc, item) => {
            const data = item.op;

            acc[data] = acc[data] || [];
            acc[data].push(item);
            return acc;
        }, {});

        const orders_b = Object.entries(by_route)
            .sort((a, b) => {
                const [diaA, mesA, anoA] = a[0].split("/").map(Number);
                const [diaB, mesB, anoB] = b[0].split("/").map(Number);
                return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
                })
            .reduce((acc, [data, itens]) => {
            acc[data] = itens;
            return acc;
        }, {});

        //console.log(by_route)
        const quee = {}
        for(const order in by_route){
            
            
            by_route[order]
                .sort((a, b) => a.client - b.client)
                .forEach(item =>{
                    if(!quee[order]) quee[order] = []
                    quee[order].push(by_op[item.op])
                    /* const obj = CLIENTS_DATA.find(pair => pair.id === item.client)
                    if(!quee[obj.client]) quee[obj.client] = []
                    quee[obj.client].push(by_op[item.op]) */
            })

            
            
        }
        console.log(quee)
        /* console.log(orders_b)
        console.log(clients) */
        //console.log(items)
//CLIENTS_DATA.find(pair => pair.client === result[4])
        //this.render(orders_b)

    }

    grouping(items, maxPerGroup = 14) {
        const groups = [];
        let currentGroup = [];
        let currentSum = 0;

        for (const item of items) {
            if (currentSum + item.qty > maxPerGroup) {
                groups.push(currentGroup);
                currentGroup = [];
                currentSum = 0;
            }

            currentGroup.push(item);
            currentSum += item.qty;
        }

        if (currentGroup.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    }

    render(data){
        const app = document.getElementById("app")

        let html = ``

        for (const group in data) {
            data[group].forEach(item => {
                html += `${item.deadline}<br/>`
            })
            
        }

        

        app.innerHTML = html
    }

    check_deadline(entry, quee_time){
        let workingDays = 0;
        let deadline = new Date(entry);

        while (workingDays < quee_time) {
            deadline.setDate(deadline.getDate() + 1);
            
            if (this.check_holiday(deadline)) {
                workingDays++;
            }
        }

        const diffInMs   = new Date(deadline) - new Date()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

        return {count:Math.round(diffInDays),deadline:deadline.toLocaleDateString()};
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
                        "11-20","12-25"
                    ];
        return weekday !== 0 && weekday !== 6 && !holidays.includes(formatedDate);
    }

}

new App



