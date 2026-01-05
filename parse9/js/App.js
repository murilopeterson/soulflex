import XLS from "./XLS.js";
import IDB from "./IDB.js";
import Util from "./Util.js";
import StringRegistry from "./REG.js"
import Database from "./Database.js"

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

    upsert(db, data, id = null){
        const database = new Database(db)
        if(id)
            return database.upsert(data, id)
        else
            return database.insert(data)
    }

    onFileChange(data) {
        if (!data) return

        const obj    = []
        const total = []
        const title  = data?.[0]?.[0] ?? ''
        const range  = data?.[0]?.[1] ?? ''
        const period = range.match(/\d{2}\/\d{2}\/\d{4}/g);

        obj["header"] = {title,from:period[0], to:period[1]}

        let current = null

        if(title.includes("Relatório"))
            data.forEach((item, index) => {

                if(typeof item[0] == 'string' && item[0].includes("Pedido: ")){
                
                    const ref       = item[1] ? Number(item[1]) : ''
                    const obs       = typeof data[index+1][0] === 'string' ? data[index+1][0] : ''
                    const priority  = obs.toUpperCase().includes("URGENTE") ? 1 : 0
                    const order     = this.orderParse(item[0])

                    let client      = {
                        name:   order.client,
                        alias:  "",
                        route:  ""
                    }
                    

                    current = order.op

                    obj[current]   = {
                        client,
                        status:     "",
                        deadline:   "",
                        sale_date:  order.sale_date,
                        invoice:    order.invoice,
                        seller:     order.seller,

                        ref, obs, priority,
                        
                        items:{},
                        payment:{}
                    }

                    return
                }

                if(current){
                    if( item.length === 5 && Number.isInteger(item[0])){
                        const itemParsed = this.itemParse(item)

                        const models     = new StringRegistry('models');
                        const model      = models.getOrRegister(itemParsed.type + " " + itemParsed.model)

                        const coats      = new StringRegistry('coats');
                        const coat       = coats.getOrRegister(itemParsed.coat)

                        const sizes      = new StringRegistry('sizes');
                        const size       = sizes.getOrRegister(itemParsed.size)
                        
                        const register   = 
                            current+
                            Util.encode(model)+
                            Util.encode(coat)+
                            Util.encode(size)+
                            item[3]

                        const product_temp    = {
                            type:        itemParsed.type,
                            model:       itemParsed.model,
                            coat:        itemParsed.coat,
                            size:        itemParsed.size,
                            qty:         item[3],
                            price:       item[2]
                        }

                        total.push(register)
                        const products = new StringRegistry('products');
                        const product  = products.getOrRegister(register);

                        obj[current].deadline = this.checkSpecials(obj[current].sale_date,item[1])
                        obj[current].items[register] = product_temp
                        /* 
                        obj[current].items[register]["price"] = item[2] */
                        
                        return
                    }
                    if( item.length === 4 && item[3] && String(item[3] || "").includes("Valor")){
                        const payments   = new StringRegistry('payments');
                        const payment    = payments.getOrRegister(item[1])
                        obj[current].payment["type"]  = payment
                        obj[current].payment["value"] = item[2]
                        return
                    }
                }

            })

        const prods = JSON.parse(localStorage.getItem("orders"))
        console.log(obj)
        
        this.genDetailsList(prods,"draggable-list")
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
        
        const keys = ["op", "sale_date", "invoice_date", "nfe", "seller", "client"];

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
        let type    = this.getStringFromArray(["BAU", "BICAMA", "TATAME", "ANTIDERRAPANTE", "PRATIC"], box)
        let model   = this.getStringFromArray(["GOLD", "PRIME", "LUXO", "DIAMANTE", "CASHEMERE", "SOUL", "EVOLUTION", "ELETRONICO"], title)
        return { type: (type || "BOX"), model: (model || "GRAN") }
    }

    coatParse(cloth){

    }

    getStringFromArray(obj, string) {
        if (!string) return null;

        const normalized = string.toUpperCase();

        return obj.find(item =>
            normalized.includes(item.toUpperCase())
        ) ?? null;
    }

    itemParse(item){
        const normalizedStr = item[1].replaceAll(".", "").replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        const model =    normalizedStr.slice(0, sizeIndex).trim()
                        .replace(/\s+/g, ' ')
                        .trim() || "";
        
        const coat = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

        //console.log(this.modelParse(type))
        return { type:this.modelParse(model).type, model:this.modelParse(model).model, coat, size}

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

    checkSpecials(sale_date,item){
        let quee_time = 7
                        
        const specials  = ["DIAMANTE", "BAU", "BICAMA"]
        const extra     = ["ELETRONICO"]

        if(specials.some(p => item.includes(p)))
            quee_time = 14
        
        if(extra.some(p => item.includes(p)))
            quee_time = 21

        return this.checkDeadline(sale_date,quee_time).deadline;

    }

    genDetailsList(data, containerId, groupKey = null) {
    if (!data || Object.keys(data).length === 0) return;

    const container = document.getElementById(containerId);
    if (!container) return;

    const entries = Object.entries(data);
    let lastGroupValue = null;

    entries.forEach(([id, obj]) => {
        const order = new StringRegistry("orders").getValueById(id)

        const currentGroupValue = groupKey ? (obj[groupKey] || "") : "";

        if (groupKey && currentGroupValue !== lastGroupValue && currentGroupValue !== "") {
            const spacer = document.createElement('div');
            spacer.style.height = "20px";
            container.appendChild(spacer);

            const groupHeader = document.createElement('h3');
            groupHeader.textContent = currentGroupValue;
            container.appendChild(groupHeader);

            lastGroupValue = currentGroupValue;
        }

        const details = document.createElement('details');
        details.dataset.id = order
        details.draggable = true;

        const summary = document.createElement('summary');
        summary.classList.toggle("red")
        const dateDisplay = obj.sale_date ? obj.sale_date.replace(/\/20(\d{2})$/, "/$1") : "";

        summary.innerHTML = `
            <span><b>${order} Cliente ${obj.client || ''}</b> - ${obj.obs || ''}</span>
            <em>${dateDisplay}</em>
        `;

        const content = document.createElement('div');
        content.style.padding = "10px";
        
        Object.entries(obj).forEach(([key, val]) => {
            if (key !== groupKey) {
                const p = document.createElement('p');
                const displayVal = Array.isArray(val) ? val.join(", ") : val;
                p.innerHTML = `<strong>${key.toUpperCase()}:</strong> ${displayVal}`;
                content.appendChild(p);
            }
        });

        details.appendChild(summary);
        details.appendChild(content);
        container.appendChild(details);

        
    });
}

getOrderData(containerId, originalData) {
    const container = document.getElementById(containerId);
    const items = container.querySelectorAll('details');
    const orderedData = {};

    items.forEach(item => {
        const id = item.dataset.id;
        if (originalData[id]) {
            orderedData[id] = originalData[id];
        }
    });

    return orderedData;
}

    genTable(data, containerId, groupKey = null) {
        if (!data || Object.keys(data).length === 0) return;

        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = Object.entries(data);
        const firstPayload = entries[0][1];
        const dataHeaders = Object.keys(firstPayload);
        
        const displayHeaders = groupKey ? dataHeaders.filter(h => h !== groupKey) : dataHeaders;
        const finalHeaders = ["ID", ...displayHeaders];

        const table = document.createElement('table');
        const thead = table.createTHead();
        const headerRow = thead.insertRow();

        finalHeaders.forEach(h => {
            const th = document.createElement('th');
            th.textContent = h.toUpperCase();
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        let lastGroupValue = null;

        entries.forEach(([id, obj]) => {
            if (groupKey && obj[groupKey] !== undefined) {
                const currentGroupValue = obj[groupKey] || "";

                if (currentGroupValue !== lastGroupValue && currentGroupValue !== "") {
                    const spacerRow = tbody.insertRow();
                    const spacerCell = spacerRow.insertCell();
                    spacerCell.colSpan = finalHeaders.length;
                    spacerCell.innerHTML = "&nbsp;"; 

                    const groupRow = tbody.insertRow();
                    const cell = groupRow.insertCell();
                    cell.colSpan = finalHeaders.length;
                    cell.textContent = currentGroupValue;
                    
                    lastGroupValue = currentGroupValue;
                }
            }

            const row = tbody.insertRow();
            const idCell = row.insertCell();
            idCell.textContent = id;

            displayHeaders.forEach(key => {
                const cell = row.insertCell();
                const val = obj[key] ?? "";
                cell.textContent = Array.isArray(val) ? val.join(", ") : val;
            });
        });

        container.appendChild(table);
    }

    generateList(list){
        list.forEach(item => {
            //console.log(item)
        })
    }

    checkDeadline(entry, quee_time){
        
        const [d, m, y] = entry.split("/").map(Number);
        const fullYear = y < 100 ? 2000 + y : y;
        
        let workingDays = 0;
        let deadline = new Date(fullYear, m - 1, d);

        while (workingDays < quee_time) {
            deadline.setDate(deadline.getDate() + 1);
            
            if (this.checkHoliday(deadline)) {
                workingDays++;
            }
        }

        const diffInMs   = new Date(deadline) - new Date()
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

        return { count: Math.round(diffInDays), deadline: this.shortenYear(deadline.toLocaleDateString())};
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

    dateFormater(dateStr) {
        const months = [
            "jan", "fev", "mar", "abr", "mai", "jun",
            "jul", "ago", "set", "out", "nov", "dez"
        ];

        const parts = dateStr.split('/');

        const day = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;

        return `${day} ${months[monthIndex]}`;
    }

    shortenYear(dateStr) {
        if (!dateStr) return "";
        return dateStr.replace(/\/20(\d{2})$/, "/$1");
    }

    formatYear(dateStr) {
        if (!dateStr) return "";
        return dateStr.replace(/\/(\d{2})$/, "/20$1");
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

function getOrderedIds(containerId, elementType) {
    const container = document.getElementById(containerId);
    if (!container) return [];

    // Busca todos os elementos do tipo (ex: 'details') dentro do container
    const items = container.querySelectorAll(elementType);

    // Transforma a lista de elementos em um array apenas com o valor do dataset.id
    return Array.from(items).map(item => item.dataset.id);
}
const container = document.getElementById('draggable-list');

container.addEventListener('dragend', (e) => {
    if (e.target.tagName === 'DETAILS') {
        e.target.classList.remove('dragging');

        // Chama a função passando o ID do container e o tipo do elemento
        const currentOrder = getOrderedIds('draggable-list', 'details');
        
        //console.log("Ordem atual dos IDs:", currentOrder);
    }
});