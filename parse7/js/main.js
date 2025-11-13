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

class Header{
    constructor(data){
        this.title = data?.[0]?.row?.[0] ?? ''
    }

    contains(text) {
        return Util.checkString(this.title, text)
    }
}

class Row{
    constructor(input){
        this.cells = { first: input[0], second: input[1], third: input[2] }
    }
    

    isOrder(){
        return Util.checkString(this.cells.first, "PEDIDO")
    }
    
    isItem(){
        const isNumber = value => typeof value === "number" && !isNaN(value);
        return (isNumber(this.cells.first) && isNumber(this.cells.third))
    }

    parseOrder(){

        if(!this.isOrder)
            return 

        const [pt1, pt2] = this.splitByClient();
        const valuesPt1  = this.extractKeyValues(pt1);
        const valuesPt2  = this.extractKeyValues(pt2);

        const keys = ["pedido", "venda", "faturado", "vendedor", "cliente"];
        const values = [...valuesPt1, ...valuesPt2];

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));;
    }

    splitByClient(){
        const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
        const match = this.cells.first.match(regexSplit);

        if (!match) return [this.output, ""];

        const firstPart  = match[1].trim();
        const secondPart = match[2].trim();

        return [firstPart, secondPart];
    }

    extractKeyValues(string) {
        const regex = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
        const result = [];

        for (const match of string.matchAll(regex)) {
            const value = match[2].trim();
            result.push(value);
        }

        return result;
    }

    get product(){
        return {item:this.cells.second, qty: this.cells.third}
    }

    get order() {

        if(this.cells.second){
            const match = this.cells.first.match(/N[º°]\s*(\d+)/i)
            return match ? match[1] : null
        }

        return this.parseOrder().pedido
    }

    get salesman(){
        return this.parseOrder().vendedor
    }

    get sale_date(){
        return this.parseOrder().venda
    }

    get income_date(){
        return this.parseOrder().faturado
    }

    get client(){
        return this.parseOrder().cliente
    }


    get observation() {
        return this.cells.second.replace(/^Obs:\s*/i, '').trim()
    }

    hasObservation(){
        return this.observation !== ''
    }


}

class ClientRepository{
    constructor(){
        this.clients = []
        this.next_id = 0
    }
    add(client){
        let client_id = null

        const existing_pair = this.clients.find(pair => pair.client === client);

        if (existing_pair) {
            client_id = existing_pair.id
            //route = existing_pair.route
        } else {
            client_id = this.next_id;
            const set = {
                id: this.next_id,
                client: client,
                route: "",
                ranting: ""
            }

            this.clients.push(set)
            this.next_id++;
        }

        return client_id
    }
}

class Orders{
    constructor(){
        this.data = []
    }

    add(order){
        this.data.push(order)
    }

    getItem(op) {
        return this.data.find(item => item.op === op);
    }

    getItemOp(op) {
        return this.data.findIndex(item => item.op === op);
    }

}

class Items{
    constructor(){
        this.data = []
        this.models = []
        this.next_id = 0
    }

    add(model){
        let model_id = null
        model = model.item
        const existing_pair = this.models.find(pair => pair.model === model);

        if (existing_pair) {
            model_id = existing_pair.id
            //route = existing_pair.route
        } else {
            model_id = this.next_id;
            const set = {
                id: this.next_id,
                model: model
            }

            this.models.push(set)
            this.next_id++;
        }

        return model_id
    }

    allocate() {
        const montadores = ["Andre", "Franscico", "Dionato", "Jeremias"];
        const itens = this.data
        const distribuicao = {};
        const totais = {};

        // Inicializa
        montadores.forEach(m => {
            distribuicao[m] = [];
            totais[m] = 0;
        });

        // Distribuição item a item
        itens.forEach(({ item, qty }) => {
            const base = Math.floor(qty / montadores.length);
            let resto = qty % montadores.length;

            // Passo 1: dar a parte base igual a todos
            montadores.forEach(m => {
                if (base > 0) {
                    distribuicao[m].push({ item, qty: base });
                    totais[m] += base;
                }
            });

            // Passo 2: distribuir o resto para quem tem menos total
            while (resto > 0) {
                // ordena os montadores por total atual (menos peças primeiro)
                const menosCarregados = [...montadores].sort((a, b) => totais[a] - totais[b]);
                const escolhido = menosCarregados[0];

                // verifica se o montador já tem o item
                const existente = distribuicao[escolhido].find(i => i.item === item);
                if (existente) {
                    existente.qty++;
                } else {
                    distribuicao[escolhido].push({ item, qty: 1 });
                }

                totais[escolhido]++;
                resto--;
            }
        });

        return { distribuicao, totais };

    }
    
}

class Item{
    constructor(model){
        this.model = model
    }
}

class Processor{
    constructor(){
        this.clients = new ClientRepository()
        this.items   = new Items()
        this.orders  = []

        this.current = null
    }
    row(input){
        const row = new Row(input)
        
        if(row.isOrder()){
            this.current = row.order;
            //this.items[this.current] = []
            
            this.orders[this.current] = {client:this.clients.add(row.client), sale:row.sale_date}
            

        }
        else if(this.current){
            this.items.add(new Item(row.product.item))
        }

        
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
        
        const header = new Header(data)

        if (header.contains("RELAÇÃO")) {
            this.handleObservationReport(data)
            return
        }

        if (header.contains("Relatório")) {
            this.handleStandardReport(data)
        }
    }

    handleObservationReport(data){

        const rows = data.slice(4).map(item => new Row(item.row))

        rows
            .filter(row => row.isOrder() && row.hasObservation())
            .forEach(row => {
                if(!this.orders[row.order]) this.orders[row.order] = []
                Object.assign(this.orders[row.order], { obs: row.observation });
            })
        
        console.log(this.orders)
    }

    handleStandardReport(data){
        
        const clients = new ClientRepository()
        const models = new Items()

        let current = null

        const rows = data.slice(2).map(item => new Row(item.row))

        rows
            //.filter(row => row.isOrder() )
            .forEach(row => {
                if(row.isOrder()){
                    if(!this.orders[row.order]) this.orders[row.order] = []
                    Object.assign(this.orders[row.order], { items: [], client: clients.add(row.client)});
                    current = row.order
                }
                if(row.isItem()){
                    models.add(row.product)
                    this.orders[current].items.push(row.product)
                }
            })

        console.log(models)
        /* const process = new Processor();
        data.slice(2).forEach(r => process.row(r.row));
        process.items.data.forEach(row => {
            this.orders.add([row.model])
        })
        console.log(this.orders) */

    }
   
}

new App