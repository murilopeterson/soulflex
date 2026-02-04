
const file = document.getElementById('file')
file.addEventListener('change', function () {
    read(file.files[0]);
})


function read(file){
    var reader = new FileReader();

    reader.onload = function (e) {
        parse(e.target.result)
    }

    reader.readAsText(file)
}

function parse(data){
    var rows = data.split('\n');
    var content = []

    rows.forEach(function (row) {
        row = row.trim();
        
        var cols = row.split(',');

        cols = cols.filter(item => item !== null && item !== '');

        if( cols.length)
            content.push(cols)

    });
    
    var result = []
    result = { header: content.splice(0,3), table: content }

    if (result.header[1][0].includes("RELAÇÃO")){
        const pRelation = []
        const items = []
        const obs = []

        result.table.forEach(row => {
            if (row[0].includes("PEDIDO")) {
                if(row[1].replace('Obs: ', '').trim() !== '')
                obs.push(row)
            }
            else{
                items.push(row)
            }
        })

        const uniques = [];
        const descricoesVistas = new Set();

        for (const [id, descricao] of items) {
            if (!descricoesVistas.has(descricao)) {
                descricoesVistas.add(descricao);
                if(descricao)
                    uniques.push(descricao.trim());
            }
        }
        render(obs)
        
    }
    if (result.header[1][0].includes("Relatório")){
        result.table.forEach(row => {

        })
        getOrders(result.table);
        console.log(getClothes(result.table))
    }
    

}


function render(data){
    const container = document.getElementById('orders-container');
    let html = '';
    /* console.log(data) */
    data.forEach((order) => {

        html += `
          <h3>${order[0]}</h3>
        `;

        for (const item of order) {
            if (!item.includes("PEDIDO")) {
                html += `
                    <p>${item}</p>
                `;
            }
        }
        
        /* order.subitems.forEach(subitem => {
          html += `
              <p><strong>${subitem.qtd} . </strong> ${subitem.model} <strong>${subitem.size}</strong> - ${subitem.cloth}</p>
          `;
        }); */
/*         
        html += `
              
        `; */
      });
      //console.log(html)
      container.innerHTML = html;
}

function removeDoubles(data){
    const uniques = [];
    const looked = new Set();

    for (const item of data) {
        if (!looked.has(item)) {
            looked.add(item);
            if(item)
                uniques.push(item.trim());
        }
    }

    return uniques
}

function report(data){
    let obj = []
    let currentItem = null;

    data.forEach(row => {
        
        if (row[0].includes("Pedido")) {
            const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
            const match = row[0].match(regexSplit);

            const pt1 = match[1].trim();
            const pt2 = match[2].trim();

            const regexKeyValue = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
            const res = {};

            const matchesPt1 = pt1.matchAll(regexKeyValue);
            for (const match of matchesPt1) {
                const key = match[1].toLowerCase().replace(/\s+/g, '_');
                const value = match[2].trim();
                res[key] = value;
            }

            const matchesPt2 = pt2.matchAll(regexKeyValue);
            for (const match of matchesPt2) {
                const key = match[1].toLowerCase().replace(/\s+/g, '_');
                const value = match[2].trim();
                res[key] = value;
            }
            currentItem = { header: res, content: [] }
            obj.push(currentItem);
        }
        else{
            if (currentItem) {
                currentItem.content.push(row);
            }
        }
        
    })

    return obj

}

function getOrders(table){
    let orders = []

    report(table).forEach(row => {
        
        let item = { 
            id:     row.header.pedido,
            sale:   row.header.data_venda,
            client: row.header.cliente,
            content: getOrderItems(row.content)
        }
        orders.push(item)

    })

    return orders
}

function getOrderItems(content){
    let items = []
    content.forEach(row => {
        let desc = parseBoxString(row[1])
        
        let item = {
            id: row[0],
            model: desc.model,
            size: desc.size,
            cloth: desc.cloth,
            qtd: row[2]
        }

        items.push(item)
    })
    return items
}

function getClients(table){
    let clientArr = []

    report(table).forEach(row => {
        clientArr.push(row.header.cliente)
    })
    return removeDoubles(clientArr)
}

function getModels(content){
    
    let models = []
    
    content.forEach(row => {
        if (!row[0].includes("Pedido")) {
            let obj = parseBoxString(row[1])
            models.push(obj.model)
        }
    })

    return removeDoubles(models)

}

function getClothes(content){
    let clothes = []
    let find = []
    content.forEach(row => {
        if (!row[0].includes("Pedido")) {
            let obj = parseBoxString(row[1])
    
            clothes.push(obj.cloth)
            //clothes.push(parseCloth(obj.cloth))            
        }
    })
    
    clothes = removeDoubles(clothes)
    //clothes = agruparPorTipo(clothes)
    console.log(clothes)

    /* let temp = []
    clothes.forEach(row => {
        temp.push({type: row.tipo, color:removeDoubles(row.cores)});
         row.cores.forEach( col => {
            console.log(col)
        }) 
        
    }) */

    //console.log(temp)
    /* let temp = []
    find.forEach(row => {
        temp.push(row[0])
    }) */
    
     

    //return find
    
}

function getSizes(content){
    
    let sizes = []
    
    content.forEach(row => {
        if (!row[0].includes("Pedido")) {
            let obj = parseBoxString(row[1])
            const pt = obj.size.split("X")
            sizes.push(`${pt[0]}X${pt[1]}`)
        }
    })

    return removeDoubles(sizes)
    
}

function getHeights(content){
    let heights = []
    
    content.forEach(row => {
        if (!row[0].includes("Pedido")) {
            let obj = parseBoxString(row[1])
            const pt = obj.size.split("X")
            if(pt[2]){
                heights.push(`${pt[2]}`)
            }
        }
    })

    return removeDoubles(heights)
}

function parseBoxString(str) {

    const normalizedStr = str.replace(/\s+/g, ' ').trim();

    const dimensionRegex = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
    const dimensionMatch = normalizedStr.match(dimensionRegex);
    let dimensions = dimensionMatch ? dimensionMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

    const dimensionIndex = dimensionMatch ? normalizedStr.indexOf(dimensionMatch[0]) : normalizedStr.length;

    var type = normalizedStr.slice(0, dimensionIndex).trim().replace("BOX", '').replace("GRAN", '').replace(/\s+/g, ' ').trim() || "BOX";

    const material = dimensionMatch ? normalizedStr.slice(dimensionIndex + dimensionMatch[0].length).trim() || "N/A" : "N/A";

    return {
        model: type,
        size: dimensions || "N/A",
        cloth: material
    };
}

function parseCloth(str){
    return str.trim().split(/\s+/)
    //console.log(dividirStringPorElemento(str, array))

}

function dividirStringPorElemento(str, array) {
    let elementoEncontrado = null;
    
    // Encontra o primeiro elemento do array que está na string
    const encontrado = array.some(elemento => {
        if (str.includes(elemento)) {
            elementoEncontrado = elemento;
            return true;
        }
        return false;
    });

    // Se nenhum elemento for encontrado, retorna a string original e null
    if (!encontrado) {
        return { elemento: null, partes: [str] };
    }

    // Divide a string com base no elemento encontrado
    const partes = str.split(elementoEncontrado);
    
    return {
        elemento: elementoEncontrado,
        partes: partes
    };
}

function sortBy(array){
    return array.sort((a, b) => a.localeCompare(b));
}

function log(data){

    const container = document.getElementById('orders-container');

    let html = '';
    data.forEach((order) => {

        html += `
          <p>${order}</p>
        `;
       
      });

      container.innerHTML = html;
}

function levenshtein(a, b) {
  const matriz = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matriz[0][i] = i;
  for (let j = 0; j <= b.length; j++) matriz[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matriz[j][i] = Math.min(
        matriz[j][i - 1] + 1, // deleção
        matriz[j - 1][i] + 1, // inserção
        matriz[j - 1][i - 1] + indicator // substituição
      );
    }
  }
  return matriz[b.length][a.length];
}


function removeArraysDuplicados(arrays) {
    // Função para normalizar array (ordena e converte para string)
    const normalizar = arr => JSON.stringify(arr.sort((a, b) => a - b));
    
    // Usa Set para remover duplicatas baseadas na string normalizada
    return [...new Set(arrays.map(normalizar))]
        // Converte de volta para arrays
        .map(str => JSON.parse(str));
}

function agruparPorTipo(arrays) {
    // Cria um objeto para armazenar os grupos
    const grupos = {};

    // Itera sobre os arrays e agrupa pelo primeiro elemento
    arrays.forEach(arr => {
        let tipo = arr[0] || 'sem-tipo'; // Usa 'sem-tipo' para arrays vazios ou sem primeiro elemento
        // Agrupa PP* e SP* como SUED
        if (tipo.startsWith('PP') || tipo.startsWith('SP')) {
            tipo = 'SUED';
        }
        if (!grupos[tipo]) {
            grupos[tipo] = [];
        }
        // Adiciona o segundo elemento (cor) ou o próprio array se não tiver cor
        grupos[tipo].push(arr[1] || arr[0]);
    });

    // Formata a saída no formato desejado
    return Object.keys(grupos).map(tipo => ({
        tipo: tipo,
        cores: grupos[tipo]
    }));
}

