import FileImporter from "./importer.js";
import Util from "./utils.js";
import Storage from "./storage.js"

class App {
    constructor(){
        this.data

        const finput    = document.getElementById('file')
        const importer  = new FileImporter(finput);

        finput.addEventListener('change', async () => {
            this.data = await importer.getFiles();
            this.handledata()
        });
    }

    handledata(){
        if (!this.data) return
        const data  = this.data.map(row => ( Object.values(row) ));
        if(this.getHeader(data).title.includes("Relatório")){
            const orders    = {}
            let currentOp  = null
            const debug = []
            data.forEach((row, index) => {

                if(this.isRowOrder(row)){
                
                    const orderData = this.orderParse(row[0]);
                    currentOp = orderData.op;

                    const rawObs = this.getRawObservation(data, index);
                    const metadata = this.extractMetadata(rawObs);
                    
                    const client = this.syncClient(orderData.client);
                    const seller = new Storage("sellers").upsert(orderData.seller);
                    const obs    = rawObs ? new Storage("observations").update(currentOp, rawObs) : '';

                    orders[currentOp] = {
                        client,
                        seller,
                        obs,
                        status:     "",
                        deadline:   "",
                        ref:        row[1] ? Number(row[1]) : '',
                        sale_date:  Util.convertDate(orderData.sale_date).excel,
                        invoice:    Util.convertDate(orderData.invoice).excel,
                        priority:   metadata.isUrgent ? 1 : 0,
                        pickup:     metadata.isPickup ? 1 : 0,
                        items:      {},
                        payment:    {}
                    };

                    return
                }

                if(currentOp){

                    if(this.isRowItem(row)){
                        const reg  = {op:currentOp, client:orders[currentOp].client}
                        const item = this.processItem(row,reg)
                        orders[currentOp].items[item.register] = item.data
                        
                        debug.push({ item:item.item, qty:item.data.qty }) //debug
                        const deadline = this.checkSpecials(Util.convertDate(orders[currentOp].sale_date).string, row[1])
                        orders[currentOp].deadline = Util.convertDate(deadline).excel
                        return
                    }

                    if(this.isPaymentRow(row)){
                        orders[currentOp].payment = this.processPayment(row)
                    }
                }

                

            })
            const res = this.consolidateTotal(debug)
            this.printObject(res)
            
            
        }
        
    }

    printObject(obj){
        Object.entries(obj).forEach(([key, value]) => {
            this.logDebug('console-debug',`${key}: ${value}` )
        });
    }

    getHeader(data) {
        return {title:data?.[0]?.[0] ?? '', period:this.extractPeriod(data?.[0]?.[1] ?? '')}
    }

    removeDoubles(arr){
        if(!Array.isArray(arr) || arr.length === 0){
            return {}
        }
        const count = {}
        arr.forEach(str => {
            const item =  String(str).trim()
            if(item){
                count[item] = (count[item] || 0) + 1
            }
        })

        const filter = Object.entries(count)
        .filter(([_, total]) => total >= 1);

        return Object.fromEntries(filter);
        return count
    }

    logDebug(parentId, content) {

        const parent = document.getElementById(parentId);
        const elem = document.createElement('div');

        elem.classList.add('element-debug');
        elem.innerHTML = content;

        parent.appendChild(elem);
    }

    consolidateTotal(arr) {
        
        if (!Array.isArray(arr) || arr.length === 0) {
            return {};
        }

        const total = {};

        arr.forEach(entry => {
            
            const item = String(entry.item || "").trim();
            const qty = Number(entry.qty) || 0;

            if (item) {
                total[item] = (total[item] || 0) + qty;
            }
        });

        return total; 
    }

    extractPeriod(str){
        const period = str.match(/\d{2}\/\d{2}\/\d{4}/g) ?? []
        return {startDate: Util.convertDate(period[0]).excel, endDate:Util.convertDate(period[1]).excel}
    }

    getRawObservation(data, index) {
        const nextRow = data[index + 1];
        return (nextRow && typeof nextRow[0] === 'string') ? nextRow[0] : '';
    }

    extractMetadata(obs) {
        const upperObs = obs.toUpperCase();
        return {
            isUrgent: upperObs.includes("URGENTE"),
            isPickup: upperObs.includes("BUSCAR")
        };
    }

    syncClient(clientName) {
        const clientSchema = {
            name: clientName,
            alias: "",
            route: ""
        };
        return new Storage("clients").upsert(clientSchema, "name");
    }

    isRowOrder(row) {
        return typeof row[0] === 'string' && row[0].includes("Pedido: ");
    }

    orderParse(order){

        const values = [];
        const regex = /([\wÀ-ÿ\.\º]+)\s*:\s*([^:]*?)(?=\s+\w[\wÀ-ÿ\.\º]*\s*:|$)/g;

        let match;
        
        while (match = regex.exec(order.replace("Nº",'').trim())) {
            const value = match[2].trim();
            values.push(value === "" ? null : value);
        }
        
        const keys = ["op", "sale_date", "invoice", "nfe", "seller", "client"];

        return Object.fromEntries(keys.map((key, i) => [key, values[i]]));

    }

    isRowItem(row){
        return row.length === 5 && Number.isInteger(row[0])
    }

    processItem(row, reg) {
        const item = this.itemParse(row);

        const type  = new Storage("types").upsert(item.type)
        const model = new Storage("models").upsert(item.model);
        const coat  = new Storage("coats").upsert(item.coat);
        const size  = new Storage("sizes").upsert(item.size);

        const register = this.generateRegisterCode(reg.op,reg.client,type, model, size, coat, row[3]);
        
        return { register,
            data:{
                type,  model, 
                coat,  size,
                qty:   row[3],
                price: row[2]
            }, item: item.title
        };

    }

    itemParse(item){
        const normalizedStr = item[1].replaceAll(".", "").toUpperCase().replace(/\s+/g, ' ').trim();

        const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
        const sizeMatch = normalizedStr.match(sizeRegx);
        const size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

        const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

        const model =    normalizedStr.slice(0, sizeIndex).trim()
                        .replace(/\s+/g, ' ')
                        .trim() || "";
        
        const coat = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

        const parsed = this.modelParse(model)
        const title = this.cleaning(normalizedStr)
        return { type:parsed.type, model:parsed.model, coat, size, title}
    }

    cleaning(str){
        if (!str) return '';
        let res = str.toUpperCase();

        const remove = [
            "BOX", "PP1", "PP2", "PP3", "PP4", "PP5", "SP1", "TECICO", "TECIDO", "TECIDDO", "PROPRIO", "PRÓPRIO",
            "SUED", "NOBOOK", "LINHO", "LIHO", "SEDA", "COURO", "VELUDO", "BUCLE", "BOUCLE", "BUOCLE", "FACTOR", "FACTON", "FACTO", "DURANGO", "EMBORRACHADO", "EMBURRACHADO", "BORDADO", "BORD",
            "NUVEM", "BEGE", "AREIA", "SEPIA", "NATURAL", "PALHA", "MUSGO", "FENDI", "CINZA", "CROMADO",  "BRONZE", "METAL",  "INOX", "PRATA", "DOURADO",
            "CAQUI", "AMENDOA", "CARAMELO", "CRAMELO", "CHOCOLATE", "CHOCO", "CACAU", "AVELA", "CREME", "PISTACHE", "CONHAQUE", "CHAMP", "CHAMPANHE", "PEROLA", "GRAFITE",
            "CLARO", "CALRO", "ESCURO",
            
            "SAFIRA 08", "DEVA 09", "DEVA 10", "SAFIRA 09","DEVA 08", "SAFIRA 10", "SAFIRA 07", "SAFIRA 7", "DEVA 07", "SAFIRA", "DEVA", "ALASKA 10", "ALASKA 11", "ALASKA 12", "ALASKA 14", "ALASKA 09", "ALASKA 08", "ALASKA 07", "ALASKA",
            "CAP", "2617", "2619", "2621", "2623", "2631", "2488", "2489", "2493", " 01"," 02"," 03"," 04"," 05"," 06",

            "CARTELA", "CATELA", "CASTELA", "TRANCOSO", "BESS", "TEC ARTE", "TEC ART", "2795", "5836", "4208", "6322", "6328", "8605", "2502", "2022", "14900", "14222",
            "CLIENTE", "LARISSA MOTA", "LORENA", "JORDANA", "VALDECI", "SALASTAR", "AMILTON", "ISABELA", "DINIZ", "SOLANITA", "WANDERLEY", "RENATA", "SENNA",
            
            "VERDE", "PRETO", "BRANCO", "ROSA", "VERMELHO", "AZUL", "MARROM", "ROSE", "WHITE", "WHIT", "OFF", "OF", "RAJA", "BUZIOS", "COPLASTICO",

            "SCOTT", "SAARA", "BARON", "BENSON", "BERSON", "TIVOLI", "AVEIA", "IPANEMA", "PIMENTA", "ICE", "GELEO", "GELO", "SNOW", "NEVOA", "SKY", "SKAY", "SISAL", "GALAXY", "URANO", "ALLEN",
            "PLUS", "ACQUABLOCK", "MARINHO", "BARGE",  "GRANITO", "SLIM", "MARFIM", "VENETO", "TORK", "TORCK", "VELUTOP", "R LUNAR", "LUNAR", "PES", "PIANO", "PIAN0", "VIP 15", "VIP", "DETALHE EM", "JADI",
            "PHILIPS", "PHILIPIS", "FOSTER", "FUNGLI", "ANHE", "DIAMOND", "PORTAL", "CAMURCA", "CASTOR", "ATACAMA", "AMASSADO", "FASANO", "MALVA", "BALLY",
            "DUNA", "MANHATA", "HOUSTON", "HUSTON", "MALIBU", "MONT CARLO 08", "MONACO", "BALRILOCHE", "ANCARA", "URUGAI", "URUGUAI", "DOMINIC", "DAKOTA", "PERSA", "INCA", "SAVANA 1", "GAVETAS",  "NOVO",
            "CRU 71", "CRU", "DECOR ", "CO DT", "P83", "LTE", "RELAX",  "JIT", "TIZA", "KLEE", "LATERAIS", "LOTUS", "CALCARIO",  "2 FAIXAS", "BRURREN",

             
            "COM", "C/", "/", "\\", "TAMPA", "REVESTIDO", "ENSACADAS", "DOIS", "DUAS", "1 LADO", "2 LADOS", "LADOS", " DO", "COR 1", " COR", "COR ",  "LISO", "CARD", "MEDIDA",
            /* "OFF E",
             "PE MADEIRA 6CM POLO ESTOFADOS","CANTONEIRA RETA","OFF", "PLAST",
            "LISO", "AMASSADO", 
            "/","\\", "RAJA","PÉS DE MADEIRA 5CM", "PISTAO 150KG LEAO AÇO" */
        ];

        remove.forEach(term => {
            res = res.split(term).join('');
        });
        
        const subst = {
           
            "4 AMORTECEDORES": "AMTC",
            "4 AMORTEC": "AMTC",
            "4 AMOR": "AMTC",
            "ANTIDERRAPANTE": "ANTD",
            "ANTIDERRAOANTE": "ANTD",
            "ANTIDERRPANTE": "ANTD",
            "SEM DIVISORIA": "SDIV",
            "S DIVISORIA": "SDIV",
            "C AUXILIAR": "AUXILIAR",
            "CAUXILIAR": "AUXILIAR",
            "GOLD CASHMERE": "CASHMERE",
            "GOLD CASHMERE": "CASHMERE",
            "CASHEMERE": "CASHMERE",
            "GOLD LUXO": "LUXO",
            "GOLD PRIME": "PRIME",
            "PRIMER": "PRIME",
            "SOUL PRATIC": "SOULPRATIC",
            "EVOLUTIN TATAMI": "TATAME EVO",
            "EVOLUTION TATAME": "TATAME EVO",
            "EVOLUTION FLUTUANTE": "TATAME EVO",
            "CEBACEIRA": "CABECEIRA",
            "C CABECEIRA": "CABC",
            "CABECEIRA": "CABC",
            "CCABC": "CABC",
            "MOLAS ENSACADAS": "MOLAS",
            "MOLAS": "MOLA",
            "MOLA": "MOLAS",
            "SEM CABC": "SCAB",
            "PARTIDA": "BIPT",
            "PARTIDO": "BIPT",
            "138X188 BIPT": "BIPT 138X188",
            "GOLD ANTD": "ANTD GOLD",
            "GOLD BAU": "BAU GOLD",
            "GOLD AMTC": "AMTC GOLD",
            "GOLD BIPT": "BIPT GOLD",
            "GOLD SDIV": "SDIV GOLD",
            "GOLD AUXILIAR": "AUXILIAR GOLD",
            "ANTD GOLD BIPT": "ANTD BIPT GOLD",
            "BICAMA BAU": "BAU BICAMA",
            "BAU AUXILIAR": "BAU BICAMA",
            "DIAMANTE TATAME": "TATAME DIAMANTE",
            "MOLAS138": "MOLAS 138",
            "GOLD MOLAS": "MOLAS GOLD",
            "TATAME193": "TATAME 193",
            "UMA LISTRA": "LISTRA",
            "1 LISTRA": "LISTRA",
            "DIAMANTE108": "DIAMANTE 108",

            " X": "X",
            "X17": "X18",
            "X25": "X23",
            "X26": "X23",
            "X30": "X28",
            "X31": "X28",
            "108X05": "108X198X05",
            "088X23": "088X188X23",
            "128X28": "128X188X28",
            "193X23": "193X203X23",
            "138X35": "138X188X35",
            "158X28": "158X193X28",
            "138X188": "138 ",
            "128X188": "128 ",
            "100X200": "1x2 ",
            "088X28": "088 X28",
            "138X23": "138 X23",
            "078X188": "078 ",
            "088X188": "088 ",
            "096X203": "096 ",
            "108X198": "108 ",
            "158X193": "158 ",
            "158X198": "158 ",
            "193X203": "193 "
        }

        for (const [tar, subs] of Object.entries(subst)) {
            res = res.split(tar).join(subs);
        }

        return res.replace(/\s+/g, ' ').trim();
    }

    modelParse(box){
        let title =  box.replace("108 COURO BEGE", 'ZZZ')
                        .replace("GRAN", "GRAND")
                        .replace("BOX BAU", "BAU")
                        .replace("BOX DIAMANTE TATAME", "TATAME DIAMOND")
                        .replace("BOX DIAMANTE", "ANTD DIAMOND")
                        .replace("DIAMANTE", "DIAMOND")
                        .replace("BOX BICAMA", "BICAMA")
                        .replace("ANTIDERRAOANTE", "ANTD")
                        .replace("ANTIDERRPANTE", "ANTD")
                        .replace("ANTIDERRAPANTE", "ANTD")
                        .replace("BOX ANTD", "ANTD")
                        .replace("CASHMERE", "CASHEMERE")
                        .replace("BOX CASHEMERE", "PRIME CASHEMERE")
                        .replace("BOX GOLD CASHEMERE", "PRIME CASHEMERE")
                        .replace("PRIMER", "PRIME")
                        .replace("BOX GOLD PRIME", "PRIME GOLD")
                        .replace("GOLD PRIME", "PRIME")
                        .replace("BOX TATAME", "TATAME")
                        .replace("BICAMA BAU", "BAU BICAMA")
                        .replace("CEBACEIRA", "CABECEIRA")
                        .replace("C/ ", "C/")
                        .replace("ELETRONICO", "ELECTRO")
                        .replace("BOX GOLD ANTD", "ANTD GOLD")
                        .replace("BOX EVOLUTIN TATAMI", "BOX EVOLUTION")
                        .replace("BOX EVOLUTION TATAME", "BOX EVOLUTION")
                        .replace("BOX EVOLUTION FLUTUANTE", "BOX EVOLUTION")
                        .replace("EVOLUTION FLUTUANTE", "BOX EVOLUTION")
                        .replace("BOX EVOLUTION", "TATAME EVO")
                        .replace("GOLD ANTD", "ANTD GOLD")
                        .replace("BOX GOLD LUXO", "GOLD LUXO")
                        .replace("GOLD LUXO", "PRIME LUX")
                        .replace("SOUL PRATIC", "SOULPRATIC")
                        .replace("MOLAS ENSACADAS", "MOLAS")
                        .replace("BICAMA MOLA", "BICAMA MOLAS")
                        .replace("GOLD MOLAS", "MOLAS GOLD")
                        
                        /* .replace("BOX DIAMANTE", "ANTD DIAMOND")BOX DIAMANTE TATAME BOX CASHEMERE
                        .replace("BOX GOLD", "ANTD DIAMOND") */
   
                        .trim()
        //console.log(title +" - " + box)

        let type    = this.getStringFromArray(["BAU", "BICAMA", "TATAME", "ANTIDERRAPANTE", "PRATIC"], box)
        let model   = this.getStringFromArray(["GOLD", "PRIME", "LUXO", "DIAMANTE", "CASHEMERE", "SOUL", "EVOLUTION", "ELETRONICO"], title)

        return { type: (type || "BOX"), model: (model || "GRAN") }
    }

    generateRegisterCode(op,client,type, model, size, coat, qty) {
        return [
            op,
            String(client).padStart(2, '0'),
            Util.encode(type),
            Util.encode(model),
            String(size).padStart(2, '0'),
            Util.encode(coat, 2),
            String(qty).padStart(3, '0')
        ].join('-');
    }

    getStringFromArray(obj, string) {
        if (!string) return null;

        const normalized = string.toUpperCase();

        return obj.find(item =>
            normalized.includes(item.toUpperCase())
        ) ?? null;
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

    isPaymentRow(row) {
        return row.length === 4 && row[3] && String(row[3]).includes("Valor");
    }

    processPayment(row) {        
        return  {
            type: new Storage("payments").upsert(row[1]),
            value: row[2]
        }
    }
}

new App()