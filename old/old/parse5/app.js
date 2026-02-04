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

class App{
    constructor(){
        this.data       = null
        this.list   = new OrderList()

        if(localStorage.getItem("soulflex") !== null){
            //const db = localStorage.getItem("soulflex")
            //this.render(JSON.parse(db))
        }

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
        const obs = [];
        const obs_DB = "soulflex_obs"
        const data = this.data.slice(2);

        data.forEach(item => {
            const col =    item.row

            if (Util.checkString(col[0], "PEDIDO")) {

                if(col[1].replace('Obs: ', '').trim() !== ''){
                    const match = col[0].match(/\d+/);                
                    const result = {
                        id: match[0],
                        obs: col[1].replace('Obs: ', '').trim()
                    }
                
                    obs.push(result)
                }
            }
        })

        let olddata = JSON.parse(localStorage.getItem(obs_DB)) || [];

        const newdata = obs.filter(item => 
            !olddata.some(old => old.id === item.id)
        );

        if (newdata.length === 0) {
            console.log('Todos os IDs informados já estão cadastrados!');
            return;
        }

        olddata = [...olddata, ...newdata];

        localStorage.setItem(obs_DB, JSON.stringify(olddata));

    }

    set_report(){
        let current = null
        const orders = []

        this.data.forEach(dataItem => {  
            
            const row = dataItem.row

            if (Util.checkString(row[0], "Pedido")){
                current =  new Order(row)                
                this.list.add(current)
            }
            else{
                if(current){
                    orders.push({id:current.opId, item: new OrderItem(row)})
                    current.add(new OrderItem(row))
                }
                    
                                      
            }

        });

        
            const uniqueArray = Object.values(
                CLIENTS.clients.reduce((acc, item) => {
                    acc[item.customer] = item;
                    return acc;
                }, {})
            );
            console.log(this.list.data)
        //localStorage.setItem("db_client_test", JSON.stringify(uniqueArray))
        //localStorage.setItem("db_orders_test", JSON.stringify(this.list.data))
    }



    load(){

        let current = null 

        this.data.forEach(dataItem => {  
            
            const row = dataItem.row

            if (Util.checkString(row[0], "Pedido")){
                current =  new Order(row)                
                this.list.add(current)
            }
            else{
                if(current)
                    current.add(new OrderItem(row))
                                      
            }

        });
        //localStorage.setItem("soulflex", JSON.stringify(this.list.data));
        //const db = localStorage.getItem("soulflex")
        
        //this.render(CLIENTS.clients)

        
        

    }

    render(data){
        
        //return
        //const container = document.getElementById('list');
        let html = ``;
        //const clientsx = []
        data.forEach(item => {
            /* if(clientsx.has(item.client)){
                
            } */
            html += `<details>
                        <summary class="green">
                            <span><b>${item.opId}</b></span><em>Restam dia(s)</em></summary>
                        <article>
                            <header>
                                <h2>${item.client}</h2>
                                <p>Data da venda: ${item.sale}</p>
                                <p>Data prazo: </p>
                            </header>
                            <section>
                                <span></span>
                                <h3>Itens:</h3>
                                <ul>`
                                item.items.forEach(elem => {
                                    html += `<li>${elem.model} ${elem.size} ${elem.cloth}<span>qtd. ${elem.qty}</span></li>`;
                                })
            html +=             `</ul>   
                            </section>
                            <footer>
                                <input type="button" class="remove-btn" onclick="removeElement(0)" value="Remover">
                            </footer>
                        </article>

                    </details> `;
        })

        container.innerHTML = html;
        
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
        this.client = CLIENTS.check(result[4])

        //CLIENTS.check(this.client)

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

        MODELS.checkType(this.model)
        MODELS.checkSize(this.size)
    }

    
}

class Model{
    constructor(type, size){

        this.typeId = null
        this.nextTypeId = 1
        this.types = []

        this.sizeId = null
        this.nextSizeId = 1
        this.sizes = []
        
        this.parse(type,size)
    }

    parse(){

    }

    checkType(type){
        const existingPair = this.types.find(pair => pair[1] === type);
    
        if (existingPair) {
            this.typeId = existingPair[0]
        } else {
            this.typeId = this.nextTypeId
            this.types.push([this.nextTypeId, type]);
            this.nextTypeId++;
        }

        return this.typeId
        
    }

    checkSize(size){
        const existingPair = this.sizes.find(pair => pair[1] === size);
    
        if (existingPair) {
            this.sizeId = existingPair[0]
        } else {
            this.sizeId = this.nextSizeId
            this.sizes.push([this.nextSizeId, size]);
            this.nextSizeId++;
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
    #nextId
    constructor(){
        this.clientId = null
        this.nextId = 1
        this.clients = []
    }

    check(client){
        const blackLegs =   ["ATUAL", "DURMA BEM"];
        const woodLegs =    ["ARMAZEM","LIH","VULER","PERFECT"];
        const diamLegs =    ["SONO&CIA","BOLIMAR"]

        const diam = diamLegs.some(word => client.toLowerCase().includes(word.toLowerCase())) ? "12 CM" : "6 CM";

        let legs = "CROMADO"

        if(blackLegs.some(word => client.toLowerCase().includes(word.toLowerCase()))){
            legs = "PRETO"
        }

        if(woodLegs.some(word => client.toLowerCase().includes(word.toLowerCase()))){
            legs = "MADEIRA 12 CM"
        }

        const existingPair = this.clients.find(pair => pair.customer === client);
        
        if (existingPair) {
            this.clientId = existingPair.id
        } else {
            this.clientId = this.nextId
            const set = {
                id: this.nextId,
                client: client,
                pes : { base: legs, diamante: diam }
        }

            //this.clients.push([this.nextId,client, legs,diam]);
            this.clients.push({id:this.clientId, customer:client, legs: legs,diam:diam, obs: "", address:""});
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

const CLIENTS = new Client()
const MODELS = new Model()

