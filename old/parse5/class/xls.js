class XLS {
    constructor(target) {
        this.data = null;
        this.target = target.files[0];
        this.read();
    }

    read() {
        return new Promise((resolve, reject) => {
            const file = this.target;
            const reader = new FileReader();

            reader.onload = (e) => {
                try {

                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    const firstSheet = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheet];

                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    this.parse(jsonData);
                    resolve(this.data);

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);

            reader.readAsArrayBuffer(file);
        });
    }

    parse(json) {

        this.data = json.map(obj => ({
            row: Object.values(obj)
        }));
        
    }

    getData() {
        return this.data;
    }
}

const MODELS = []

class App{
    constructor(){
        this.data       = null    

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
    
        if(this.data)
            this.load()
     
    }

    load(){

        let current = null
        let item    = null

        const list     = new OrderList()
        //const items     = new OrderItem()
        const client    = new Client
 

        this.data.forEach(dataItem => {  
            
            const row = dataItem.row

            if (Util.checkString(row[0], "Pedido")){
                current =  new Order(row)                
                list.add(current)
            }
            else{
                if(current)
                    current.add(new OrderItem(row))
                                      
            }

        });

        console.log(list)

    }

}


class Order{
    
    constructor(orderItem){
        this.opId, this.sale, this.income, this.seller, this.client, this.clientId, this.obs, this.status
        this.items = []

        this.parse(orderItem[0])
        
    }

    parse(data){

        if(typeof data !== 'string') return  [0,"","","",""];

        const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
        const match = data.match(regexSplit);
        
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

        this.opId   = Number(result[0])
        this.sale   = result[1]
        this.income = result[2]
        this.seller = result[3]
        this.client = result[4]

    }

    setClientID(clientId){
        this.clientId = clientId;
    }

    setStatus(status){
        this.status = status;
    }

    add(data){
        this.items.push(data)
    }

    getAll(){
        return this.orders
    }
}

class OrderItem{
    constructor(itemData){
        this.model, this.size, this.cloth, this.qty, this.kit, this.status, this.obs      
        this.parse(itemData)
        
    }

    parse(data){

        if(typeof data[1] !== 'string') return  [0,"","","",""];

        const normalizedStr = data[1].replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        let size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        var type = normalizedStr.slice(0, sizeIndex).trim().replace("BOX", '').replace("GRAN", '').replace(/\s+/g, ' ').trim() || "BASE";

        const material = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

        this.model = type
        this.size = size
        this.cloth= material
        this.qty  = data[2]
    }

    
}

class Model{
    constructor(type, size){

        this.modelId = null
        this.nextId = 1
        this.models = []
        
        this.parse(type,size)
    }

    parse(){

    }

    check(model){
        const existingPair = this.models.find(pair => pair[1] === model);
    
        if (existingPair) {
            this.modelId = existingPair[0]
        } else {
            this.modelId = this.nextId
            this.models.push([this.nextId, model]);
            this.nextId++;
        }

        return this.modelId
        
    }
}

class OrderList{
    constructor(){
        this.data = []
    }
    add(data){
        this.data.push(data)
    }
}

class Client{
    constructor(){
        this.clientId = null
        this.nextId = 1
        this.clients = []
    }

    check(client){
        const existingPair = this.clients.find(pair => pair[1] === client);
    
        if (existingPair) {
            this.clientId = existingPair[0]
        } else {
            this.clientId = this.nextId
            this.clients.push([this.nextId, client]);
            this.nextId++;
        }

        return this.clientId
        
    }
}

class Obs {
    constructor(){}
}

class Util{
    constructor(){}
    static checkString(a, b) {
        if (typeof b !== "string" || b === "") return false;

        if (typeof a === "string") {
            return a.includes(b);
        }

        if (typeof a === "number" && !isNaN(a)) {
            return String(a).includes(b);
        }

        if (Array.isArray(a)) {
            return a.some(item => checkString(item, b));
        }

        if (typeof a === "object" && a !== null) {
            return Object.values(a).some(value => checkString(value, b));
        }

        return false;
    }
}

new App()

