import XLS from "./XLS.js";
import IDB from "./IDB.js";
//import Util from "./Util.js";

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

                    current = order.op

                    obj[order.op] = {
                        info: item[0],
                        order,
                        client:order.client,
                        sale_date:order.sale_date,
                        ref,obs,
                        deadline: "",
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
                }

            })

        this.generateList(obj)
    }

    saveClient(client){

        const clientsDB = new IDB("MeuDB", "clients", {
            keyPath: "id",
            autoIncrement: false,
            indexes: [
                { name: "route_code", key: "route" },
                { name: "client_name", key: "client" }
            ]
        });


        (async () => {
            console.log("Iniciando o salvamento de todos os clientes em uma única transação...");

            try {
                // Chama o novo método saveAll com o array completo
                const savedKeys = await clientsDB.saveAll(CLIENTS_DATA);
                
                console.log(`Sucesso! Foram salvos ${savedKeys.length} clientes.`);
                console.log("Chaves dos clientes salvos (devem ser os IDs):", savedKeys);
                
            } catch (error) {
                console.error("Erro ao salvar o array de clientes:", error);
            }
        })();
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

    modelParse(box){
        let title =  box.replace("108 COURO BEGE", 'ZZZ')
                        /* .replace("BOX ", '')
                        .replace("GRAN", '')
                        .replace("GOLD", '')
                        .replace("SOUL", '')
                        .replace("DIAMANTE", '')
                        .replace("PRIME", '')
                        .replace("CASHMERE", "CASHEMERE")
                        .replace("CASHEMERE", "") */
                        .replace("BOX BAU", 'BAU')
                        .replace("GOLD LUXO", 'LUXO')
                        .replace("BOX TATAME", 'TATAME')
                        .replace("BOX EVOLUTION", 'TATAME EVOLUTION')
                        .replace("BOX BICAMA", 'BICAMA')
                        .replace("BOX DIAMANTE TATAME", 'TATAME DIAMANTE')
                        .replace("GOLD PRIME", 'PRIME')
                        .replace("PARTIDA", 'PARTIDO')
                        .replace("CABECEIRA LISTRAS", 'LISTRAS')
                        .replace("GOLD CASHMERE", 'CASHEMERE')
                        .replace("ANTIDERRAOANTE", 'ANTIDERRAPANTE')
                        .replace("ANTIDERRPANTE", 'ANTIDERRAPANTE')
                        .replace("UMA LISTRA", '1 LISTRA')
                        .replace("C/", 'COM')

                        /*.replace("BOX ",'')
                        .replace("GRAN PARTIDO", 'BOX PARTIDO')
                        .replace("GRAN",'')
                        .replace("GOLD",'')
                        .replace("LISTRAS",'')
                        .replace("1 LISTRA",'')
                        .replace("LISA",'') */
                        .trim()
        let type    = this.getItemType(["BAU", "BICAMA", "TATAME", "ANTIDERRAPANTE", "PRATIC"], box)
        let model   = this.getItemType(["GOLD", "PRIME", "LUXO", "DIAMANTE", "CASHEMERE", "SOUL", "EVOLUTION", "ELETRONICO"], title)
        return { type: (type || "BOX"), model: (model || "GRAN"), box}
    }

    getItemType(items, title) {
        if (!title) return null;

        const normalized = title.toUpperCase();

        return items.find(item =>
            normalized.includes(item.toUpperCase())
        ) ?? null;
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

        console.log(this.modelParse(type))
        return

        let newmodel =  type.replace("108 COURO BEGE", 'ZZZ')
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

    generateList(list){
        list.forEach(item => {
            console.log(item)
        })
    }

    checkDeadline(entry, quee_time){
        
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

    checkHoliday(date){

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

}

new App;

class DragAndDropList {
    constructor(listElement, draggableSelector = 'details') {
        this.list = typeof listElement === 'string' ? document.querySelector(listElement) : listElement;
        this.draggableSelector = draggableSelector;
        this.draggedItem = null;

        if (!this.list) {
            console.error('O elemento da lista não foi encontrado.');
            return;
        }

        this.init();
    }

    init() {
        this.setupDraggables();
        this.addEventListeners();
    }

    setupDraggables() {
        const items = this.list.querySelectorAll(this.draggableSelector);
        items.forEach(item => {
            item.setAttribute('draggable', 'true');
        });
    }

    addEventListeners() {
        this.list.addEventListener('dragstart', this.handleDragStart.bind(this));
        this.list.addEventListener('dragend', this.handleDragEnd.bind(this));
        this.list.addEventListener('dragover', this.handleDragOver.bind(this));
        this.list.addEventListener('drop', this.handleDrop.bind(this));
    }

    handleDragStart(e) {
        this.draggedItem = e.target.closest(`${this.draggableSelector}[draggable="true"]`);

        if (this.draggedItem) {
            setTimeout(() => {
                this.draggedItem.classList.add('dragging');
            }, 0);
        }
    }

    handleDragEnd(e) {
        if (this.draggedItem) {
            this.draggedItem.classList.remove('dragging');
            this.draggedItem = null;
        }
    }

    handleDragOver(e) {
        e.preventDefault();

        if (!this.draggedItem) return;

        const currentItem = e.target.closest(this.draggableSelector);

        if (currentItem && currentItem !== this.draggedItem) {
            const rect = currentItem.getBoundingClientRect();
            const center = rect.y + rect.height / 2;

            if (e.clientY < center) {
                this.list.insertBefore(this.draggedItem, currentItem);
            } else {
                this.list.insertBefore(this.draggedItem, currentItem.nextSibling);
            }
        }
    }

    handleDrop(e) {
        e.preventDefault();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const listManager = new DragAndDropList('#draggable-list');
});