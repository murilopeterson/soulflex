const app   = document.getElementById('app')
const file  = document.getElementById('file')

let _header     = {}
let _content    = {}
let _obslist    = []
let _orderlist  = []

let _clients    = []

let _clothes    = []
let _models     = []

let _boxes      = []

document.getElementById('file').addEventListener('change', function (file) {
    readXLS(file.target)
})

function readXLS( target ) {
    const file = target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        parseXLS(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
}

function parseXLS( json ){
    const data = json.map(obj => ({
        row: Object.values(obj)
    }));

    setHeader(data.slice(0, 1))
    

    if (checkString(_header.title, "RELAÇÃO")){
        setObsList(data.slice(2))
    }

    if (checkString(_header.title, "Relatório")){
        setOrderList(data.slice(2))
        
        
        //_clothes = sortAz(removeDoublesArr(_clothes))
        //_models = sortAz(removeDoublesArr(_models))

        _clients = removeDoublesArr(_clients)

       
        //console.log(_models);
        //_boxes = removeDoublesArr(_boxes)
        //render(sortAz(removeDoublesArr(_clients)));

        //console.log(sortOrders(_orderlist))

        

    }
}

function setHeader( obj ){

    let temp = obj[0].row

    _header = {
        title:      temp[0],
        timeframe:  temp[1] || "",
        pagesRange: temp[2] || ""
    }

}

function setObsList( data ){

    data.forEach(item => {

        const row = item.row
        if (checkString(row[0], "PEDIDO")) {

            if(row[1].replace('Obs: ', '').trim() !== ''){
                const match = row[0].match(/\d+/);                
                const result = {
                    id: match[0],
                    obs: row[1].replace('Obs: ', '').trim()
                }
            
                _obslist.push(result)
            }
        }
    })
}

function setOrderList( data ){

    let currentRow = null;
    let clientId
    let nextId = 1

    data.forEach(item => {

        let row = item.row;
         
        

        if (checkString(row[0], "Pedido")) {
            currentRow = setOrder(row[0]);
            
            const existingPair = _clients.find(pair => pair[1] === currentRow.order[4]);
    
            if (existingPair) {
               clientId = existingPair[0]
            } else {
                clientId = nextId
                _clients.push([nextId, currentRow.order[4]]);
                nextId++;
            }

            _orderlist.push(currentRow.order);

        }else{
            if (currentRow){
                currentRow.items.push(setOrderItem(row,currentRow.order[0], clientId || --nextId));
                //console.log(currentRow.order[4],nextId)
            }
                
        }

        
        

    });

    
}

function setOrder( obj ){
    let order = parseOrder(obj);
    // config order
    return { order, items: [] }
}

let tempid = 1

function setOrderItem(obj,orderId,clientId){
    let _box    = {}
    let items = parseOrderItems(obj)

    items[1] = items[1]
                .replace("BASE DIAMANTE", 'DIAMANTE')
                .replace("BASE GOLD", 'GOLD')
                .replace("GOLD PRIME", 'PRIME')
                .replace("GOLD CASHMERE", 'CASHMERE')
                .trim()

    items[3] = items[3]
                .replace("BUCLE", '')
                .replace("LINHO DEVA", 'DEVA')
                .replace("DEVA", 'LINHO DEVA')
                .replace("SAFIRA", 'LINHO SAFIRA')
                .replace("ALASKA", 'BOUCLE ALASKA')
                .replace("PP", 'SUEDE PP')
                .replace("SP1", 'SUEDE SP1')
                .replace("CARAMELO/ ", 'COURO CARAMELO /')
                .replace("CHOCOLTE", 'CHOCOLATE')
                .replace("FACTOR", 'FACTON')
                .replace("URUGUAI", 'COURO URUGUAI')
                .replace("AREIA", 'BEGE')
                .trim()

    // BUG
    if(items[0] == 6983){
        items[1] = "BAU"
        items[2] = "108X198"
        items[3] = "COURO BEGE"
    }
    
    _clothes.push(items[3])
    //_models.push(items[1])

    items[1] = items[1]
                .replace(" GOLD", '')
                .replace("GOLD ", 'BASE ')
                .replace(" 1 LISTRA", '')
                .replace("CASHMERE", 'PRIME')
                .replace("LUXO", 'PRIME')
                .replace(" LISA", '')
                .replace("GOLD", 'BASE')
                .trim()
    //[tipo,modelo,tamanho,quantidade,altura,pecas,pes,chapa de juncao, chapa de encaixe,pistao,mecanismo,cantoneira,tampa,cabeceira,parafusos,porcas,aparador,puxador,rodinhas]

    ;

    _box = {
        id: _boxes.length,
        order: orderId,
        client: clientId,
        product: items[0],
        box:"",
        size:"",
        cloth:"",
        status: [],
        qty: items[4],
        obs: ""
    }

    let typeBox = items[1].match(/^(\S+)\s*(.*)/);
    //console.log(typeBox)
    const existingPair = _models.find(pair => pair[1] === typeBox[1]);
    
    if (existingPair) {
        _box.box = existingPair[0]
    } else {
        _box.box = tempid
        _models.push([tempid, typeBox[1]]);
        tempid++;
    }

    let _box1 = {
        productId: items[0],
        type: items[1],
        model: "",
        feature: "",
        size: items[2].split("X")[0],
        height: "",
        partsQty: "",
        legsQty: "",
        legsColor: "",
        legsType: "",
        joinPlate: "",
        lockPlate: "",
        pistonForce: "",
        pistonQty: "",
        mech: "",
        cornerGuard: "",
        cover: "",
        head: "",
        screws: "",
        nuts: "",
        stopper: "",
        handle: "",
        wheels: "",
    }
    let box = [items[1],items[2],items[4],orderId, clientId]

    //console.log(_box)
    _boxes.push(_box)
    // config items
    return items
}

function parseOrder(data){

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

    return result
}

function parseOrderItems(data){
    
    if(typeof data[1] !== 'string') return  [0,"","","",""];

    const normalizedStr = data[1].replace(/\s+/g, ' ').trim();

    const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
    const sizeMatch = normalizedStr.match(sizeRegx);
    let size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

    const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

    var type = normalizedStr.slice(0, sizeIndex).trim().replace("BOX", '').replace("GRAN", '').replace(/\s+/g, ' ').trim() || "BASE";

    const material = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

    return [data[0],type,size,material,data[2]]
    

    
    
}

function sortOrders(orders, sortBy = 'date') {
  return orders.sort((a, b) => {
    if (sortBy === 'date') {
      const [dayA, monthA, yearA] = a.order[1].split('/').map(Number);
      const [dayB, monthB, yearB] = b.order[1].split('/').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
    } else if (sortBy === 'id') {
      return a.order[0].localeCompare(b.order[0], undefined, { numeric: true });
    } else if (sortBy === 'string') {

      const strA = a.order[2] || '';
      const strB = b.order[2] || '';
      return strA.localeCompare(strB, undefined, { sensitivity: 'base' });
    }
  });
}


function countBySize(boxes) {
  const result = {};

  boxes.forEach(([type, size, qty]) => {
    if (!result[type]) {
      result[tipo] = {};
    }

    if (!result[type][size]) {
      result[type][size] = 0;
    }

    result[type][size] += qty;
  });

  return result;
}

// Utils
function checkString(a, b) {
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

function removeDoublesArr(array) {
    return array.filter((item, index, self) =>
        item !== undefined &&
        Object.keys(item || {}).length > 0 &&
        index === self.findIndex(i => JSON.stringify(i) === JSON.stringify(item))
    );
}

function sortAz(array){
    return array.sort((a, b) => a.localeCompare(b));
}


function render(data){
    const container = document.getElementById('app');

    let html = `${parseRender(data)}`;
    container.innerHTML = html;
}

function parseRender(data){
    let html = ``;
    data.forEach(item => {
        html += `<div><p>${item}</p></div>`;
    })

    return html;
}