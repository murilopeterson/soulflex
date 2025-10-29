import XLS from "./XLS.js";
import DB from "./IDB.js";
import Util from "./Util.js";

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

                const existing_pair = clients.find(pair => pair.client === result[4]);

                if (existing_pair) {
                    client_id = existing_pair.id
                } else {
                    client_id = next_id;
                    const set = {
                        id: next_id,
                        client: result[4]
                    }

                    clients.push(set);
                    next_id++;
                }

                const datecheck = this.check_deadline(Util.check_date(result[1]))

                const order = {
                    op:     Number(result[0]),
                    sale:   result[1],
                    deadline: datecheck.deadline,
                    count: datecheck.count,
                    //income: result[2],
                    //seller: result[3],
                    client: client_id 
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

        const orders_a = orders.reduce((acc, item) => {
            const data = item.deadline;

            acc[data] = acc[data] || [];
            acc[data].push(item);
            return acc;
        }, {});

        const orders_b = Object.entries(orders_a)
            .sort((a, b) => {
                const [diaA, mesA, anoA] = a[0].split("/").map(Number);
                const [diaB, mesB, anoB] = b[0].split("/").map(Number);
                return new Date(anoA, mesA - 1, diaA) - new Date(anoB, mesB - 1, diaB);
                })
            .reduce((acc, [data, itens]) => {
            acc[data] = itens;
            return acc;
        }, {});


        console.log(orders_b)
        console.log(clients)
        console.log(items)

        this.render(orders_b)

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

    check_deadline(entry){
        let workingDays = 0;
        let deadline = new Date(entry);

        while (workingDays < 10) {
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



