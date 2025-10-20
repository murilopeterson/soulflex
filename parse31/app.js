const app   = document.getElementById('app')
const file  = document.getElementById('file')

let requestArr  = []
let reportArr   = []

let meta        = []
let types       = []
let features    = []
let products    = []
let customers   = []
let sellers     = []
let sizes       = []
let heights     = []
let clothTypes  = []
let clothColors = []

file.addEventListener('change', function (e) {
    readXls(e)
})


function readXls(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];

        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        parseXls(jsonData);
        
        const btns = document.querySelectorAll(".button")

        if (reportArr.length !== 0 && requestArr.length !== 0) {
            
            requestArr.forEach(item => {
                updateOrder(reportArr,item.id, "obs", item.obs)
            })
            
            btns.forEach(btn => {
                btn.classList.toggle('hide');
            });
            render(reportArr)
            //reportArr.unshift(meta);
            //console.log(reportArr)
            
        }else if(reportArr.length !== 0){
            render(reportArr)
        }
        
        //console.log(jsonData);
    };
    
    reader.readAsArrayBuffer(file);
}

function parseXls(json){
    const remap = json.map(obj => ({
        row: Object.values(obj)
    }));

    const header = remap.slice(0, 1);
    const table = remap.slice(2);

    const title = header[0].row;

    if (checkString(title[0], "RELAÇÃO")){
        requestArr = request(table)
    }

    if (checkString(title[0], "Relatório")){
        reportArr = report(table)
        meta = title
        //console.log(products, sellers, customers, sizes, clothTypes, clothColors, heights)
        console.log(products)
    }
}

function request(data){
    const obs = [];

    data = data.slice(2);

    data.forEach(item => {
        const col =    item.row

        if (checkString(col[0], "PEDIDO")) {

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

    return obs
}

function report(data){

    const obj = []
    let currentOrder = null;

    data.forEach(item => {
        let col = item.row[0]
        
        if (checkString(col, "Pedido")) {
            
            const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
            const match = col.match(regexSplit);

            const pt1 = match[1].trim();
            const pt2 = match[2].trim();

            const regexKeyValue = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
            const result = {};

            const matchesPt1 = pt1.matchAll(regexKeyValue);
            for (const match of matchesPt1) {
                const key = match[1].toLowerCase().replace(/\s+/g, '_');
                const value = match[2].trim();
                result[key] = value;
            }

            const matchesPt2 = pt2.matchAll(regexKeyValue);
            for (const match of matchesPt2) {
                const key = match[1].toLowerCase().replace(/\s+/g, '_');
                const value = match[2].trim();
                result[key] = value;
            }

            currentOrder = { 
                customer: result.cliente,
                invoice_date: result.data_fat,
                sale_date: result.data_venda,
                id: result.pedido,
                obs: null,
                seller: result.vendedor,
                qtys: [],
                items: []
            }

            customers.push(currentOrder.customer)
            sellers.push(currentOrder.seller)

            obj.push(currentOrder);
        }
        else{
            if (currentOrder) {
                
                const normalizedStr = item.row[1].replace(/\s+/g, ' ').trim();

                const sizeRegx = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
                const sizeMatch = normalizedStr.match(sizeRegx);
                let size = sizeMatch ? sizeMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

                const sizeIndex = sizeMatch ? normalizedStr.indexOf(sizeMatch[0]) : normalizedStr.length;

                var type = normalizedStr.slice(0, sizeIndex).trim().replace(/\s+/g, ' ').trim() || "";
                //var type = normalizedStr.slice(0, sizeIndex).trim().replace("BOX", '').replace("GRAN", '').replace(/\s+/g, ' ').trim() || "";

                const material = sizeMatch ? normalizedStr.slice(sizeIndex + sizeMatch[0].length).trim() || "N/A" : "N/A";

                let parts = 1
                let headboard = 0
                let lid = 0

                const pt = size.split("X")
                if(pt[0] || pt[1])
                    sizes.push(`${pt[0]}x${pt[1]}`)

                const cond = ["BICAMA", "BAU", "TATAME"]
                if(!cond.includes(type.toUpperCase().split(" ")[0])){
                    //type = "BASE "+type
                }

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
                
                type = type.split(" ");
                let feature = type.slice(1).join(" ")
                type = type[0]
                
                types.push(type)

                let model = {type: type, size: size, feature: feature, qty: item.row[2]}

                let newItem =  {
                    id: item.row[0],
                    model: type,
                    //size: `${pt[0]}x${pt[1]}`,
                    size: size,
                    height: pt[2] ?? "",
                    feature: feature,
                    parts: parts,
                    cloth: material,
                    headboard:headboard,
                    lid:lid,
                    qty: item.row[2]
                };

                currentOrder.items.push(newItem);


                clothTypes.push(newItem.cloth)
                heights.push(pt[2])
                products.push(model)

            }
        }
        
    });

    sellers = removeDoublesArr(sellers)

    clothTypes = removeDoublesArr(clothTypes)
    types = removeDoublesArr(types)
    sizes = removeDoublesArr(sizes)
    heights = removeDoublesArr(heights)
    customers = removeDoublesArr(customers)
    //products = removeDoublesArr(products)
    
    return obj
}



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


function updateOrder(array, id, key, value) {
    const obj = array.find(item => item.id === id);
    
    if (obj) {
        obj[key] = value;
        return true;
    }
    
    return false;
}

function removeDoubles(strArr){
    const uniques = [];
    const looked = new Set();

    for (const item of strArr) {
        if (!looked.has(item)) {
            looked.add(item);
            if(item )
                uniques.push(item.trim());
        }
    }

    return uniques
}

function removeDoublesArr(array) {
    return array.filter((item, index, self) =>
        item !== undefined &&
        Object.keys(item || {}).length > 0 &&
        index === self.findIndex(i => JSON.stringify(i) === JSON.stringify(item))
    );
}

function renderbyname(){
    reportArr.sort((a, b) => a.customer.localeCompare(b.customer));
    render(reportArr)
}

function renderbydate(){
    reportArr.sort((a, b) => a.id.localeCompare(b.id));
    render(reportArr)
}

function checkdate(dateStr) {
    const [day, month, year] = dateStr.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);
    const currentDate = new Date();

    if (isNaN(inputDate)) return false;

    let businessDays = 0;
    const start = new Date(Math.min(currentDate, inputDate));
    const end = new Date(Math.max(currentDate, inputDate));

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() % 6) businessDays++;
    }

    return businessDays > 5;
}

function render(data){
    

    //data.sort((a, b) => a.customer.localeCompare(b.customer));

    const container = document.getElementById('app');
    const recent_orders = []

    let html = `<small class="document-date">${meta[1]}</small>`;

    data.forEach((order) => {
        
        if(checkdate(order.sale_date)){
            recent_orders.push(order)
            return
        }

        let lids = 0
        let headboards = 0
        let parts = 0
        let qtys = 0
        order.items.forEach((item) => {
            parts += item.parts * item.qty
            headboards += item.headboard * item.qty
            lids += item.lid * item.qty
            qtys += item.qty
        })

        
        html += `
            <label class="pedido-section" for="order-${order.id}">
                <input type="checkbox" id="order-${order.id}" value="${order.id}"/>
                <div class="checkbox-container">
                    <div class="order-title"><h4>${order.id} - ${order.customer} </h4><small>${order.sale_date}</small></div>
                    ${order.obs ? "<p><strong>Obs</strong>: "+ order.obs + "</p>" : ""}
                    <p>
                        <small class="order-details details"> 
                            ${qtys} ${(qtys > 1) ? "camas ":"cama"}
                            ${parts ? parts + " peça(s) " : ""}
                            ${headboards ? headboards + " cabeceira(s) " : ""}
                            ${lids ? lids + " tampa(s)" : ""}
                        </small>
                    </p>
        `;  
            
            order.items.forEach((item) => {
                html += `<div>
                    <p>
                    ${item.qty} - ${item.model} ${item.feature || ""} ${item.size.split("x")[0]}${item.height ? "x"+item.height : ""} 
                    ${item.cloth}
                        <!--<small class="item-details details"> 
                            ${item.parts ? item.parts * item.qty + "pç " : ""}
                            ${item.headboard ? item.headboard * item.qty + "cab " : ""}
                            ${item.lid ? item.lid * item.qty + "tamp " : ""}
                        </small>-->
                    </p>
                    </div>
                
                `;
            })
        
        html += `</div>
            </label>
              
        `;
    });

    const totalByGroup = products.reduce((acc, item) => {
        const key = `${item.type}-${item.feature}-${item.size}`;
        acc[key] = (acc[key] || 0) + item.qty;
        return acc;
    }, {});
    html += `<div class="products-total">`
    Object.entries(totalByGroup).forEach(([key, qty]) => {
        const [type, feature, size] = key.split('-');
        html += `<p>${qty}x ${type} ${feature} ${size}</p>`;
    });
    html += `</div>`
    
    container.innerHTML = html;
}

function setPageSize(cssPageSize) {
    const style = document.createElement('style');
    style.innerHTML = `@page {size: ${cssPageSize}}`;
    document.head.appendChild(style);
}

function gentag(){

    
    const data = reportArr

    document.getElementsByTagName('main')[0].classList.toggle("no-print")
    setPageSize('100mm 50mm');
    document.body.classList.toggle("tag-print")    

    const container = document.getElementById('tagGenerator');

    let html = ``;

    data.forEach((order) => {

       if(checkdate(order.sale_date)){
            return
        }

        let lids = 0
        let headboards = 0
        let parts = 0

        order.items.forEach((item) => {

           

            parts += item.parts * item.qty
            headboards += item.headboard * item.qty
            lids += item.lid * item.qty
            parts = parts + headboards + lids

            let contador = 0;
            let letraAtual = '@';

            const total_item_parts = item.parts + item.lid +item.headboard

            for(let i = 1; i<= item.qty * total_item_parts; i++){
                
                if (contador % total_item_parts === 0) {
                    letraAtual = String.fromCharCode(letraAtual.charCodeAt(0) + 1);
                    contador = 0;
                }

                contador++
                    html += `
                
                        <div class="tag order-details details">
                            <div class="order">${order.id}</div>`

                if(total_item_parts > 1 )
                    html += `<h1 class="order-pair">${letraAtual}</h1>`

                    html += `<div class="product"><h2>${item.model} ${item.feature || ""} ${item.size}</h2>
                            <h3>${item.cloth}</h3></div>
                            
                            

                            <div class="client"><h4>${order.customer}</h4></div>
                            <div>Ateliê Soulflex - 62.409582/0001-11</div>
                            
                            
                        </div>
                            
                    `;
                }
            
            
        })
        /* total = parts + headboards + lids
        order.items.forEach((item, index, arr) => {

            
            //if (index === arr.length - 1){
                
                console.log(item.size,total,item.qty)
                
            //}
            
        }) */
        
          

      
        
        html += ``;

      });

      container.innerHTML = html;

      //document.getElementById('page-print').classList.toggle("hide")

}
// Função para deletar pedidos selecionados
    function deleteSelectedOrders() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const pedidosToDelete = Array.from(checkboxes).map(cb => cb.value);

      // Filtrar os pedidos, mantendo apenas os não selecionados
     objeto =reportArr.filter(order => !pedidosToDelete.includes(order.id));

      // Re-renderizar as tabelas
      reportArr = objeto
      render(reportArr);
    }
    





function toggleCheckboxes() {
            // Seleciona todos os checkboxes da página
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            // Inverte o estado de cada checkbox
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
            });
        }