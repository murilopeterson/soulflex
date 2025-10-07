
    var DELIMITER = ',';
    var NEWLINE = '\n';
    var qRegex = /^"|"$/g;
    var i = document.getElementById('file');
    var table = document.getElementById('table');
let  objeto = [];
var arrayUnico = []

    i.addEventListener('change', function () {
        if (!!i.files && i.files.length > 0) {
            parseCSV(i.files[0]);
        }
    });

    function parseCSV(file) {
        if (!file || !FileReader) {
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            toTable(e.target.result);
        };

        reader.readAsText(file);
    }

    

    function toTable(text) {

        var rows = text.split(NEWLINE);

        var content = []
        

        rows.forEach(function (r) {
            r = r.trim();

            var cols = r.split(DELIMITER);

            cols = cols.filter(item => item !== null && item !== '');

            cols.forEach(function (c) {
                
                var tc = c.trim();
                tc = tc.replace(qRegex, '');
                
            })

            if( cols.length)
                content.push(cols)

            /* console.log(pedidos) */
        });


        var result = [];
        result = { header: content.splice(0,3), table: content }
        let currentItem = null;

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


      result.table.forEach(linha => {

          
          
            console.log(linha)
            if (linha[0].includes("Pedido")) {
                
                const str = linha[0]
                // Passo 1: Dividir a string em duas partes usando regex
                const regexSplit = /^(.*?)(\s*Cliente\s*:.*)$/;
                const match = str.match(regexSplit);

                const parte1 = match[1].trim();
                const parte2 = match[2].trim();

                // Passo 2: Extrair pares chave-valor e construir um único objeto
                const regexKeyValue = /(\w+(?:\s+\w+)?):\s*([^:]*?)(?=\s*(?:\w+(?:\s+\w+)?:(?:\s|$)|$))/g;
                const result = {};

                // Processar parte1
                const matchesParte1 = parte1.matchAll(regexKeyValue);
                for (const match of matchesParte1) {
                    const chave = match[1].toLowerCase().replace(/\s+/g, '_');
                    const valor = match[2].trim();
                    result[chave] = valor;
                }

                // Processar parte2
                const matchesParte2 = parte2.matchAll(regexKeyValue);
                for (const match of matchesParte2) {
                    const chave = match[1].toLowerCase().replace(/\s+/g, '_');
                    const valor = match[2].trim();
                    result[chave] = valor;
                }
                currentItem = { item: result, subitems: [] };
                objeto.push(currentItem);
                
                
                


                
            }
            else{
              
                function parseBoxString(str) {
                  // Normalizar a string, removendo espaços extras
                  const normalizedStr = str.replace(/\s+/g, ' ').trim();

                  // Expressão regular para dimensões (captura com ou sem espaço antes da altura)
                  const dimensionRegex = /\d+[xX]\d+(?:\s*[xX]\d+)?/;
                  const dimensionMatch = normalizedStr.match(dimensionRegex);
                  let dimensions = dimensionMatch ? dimensionMatch[0].replace(/\s*([xX])\s*/g, '$1').toUpperCase() : "";

                  // Encontrar o índice das dimensões
                  const dimensionIndex = dimensionMatch ? normalizedStr.indexOf(dimensionMatch[0]) : normalizedStr.length;

                  // Type: tudo antes das dimensões
                  var type = normalizedStr.slice(0, dimensionIndex).trim().replace("BOX", '').replace("GRAN", '').replace(/\s+/g, ' ').trim() || "BOX";

                  // Material: tudo após as dimensões
                  const material = dimensionMatch ? normalizedStr.slice(dimensionIndex + dimensionMatch[0].length).trim() || "N/A" : "N/A";
                    
                  return {
                  id: linha[0].trim(),
                  model: type,
                  size: dimensions || "N/A",
                  cloth: material,
                  qtd: linha[2].trim()
                  };
                }

                const result = parseBoxString(linha[1]);

                if (currentItem) {
                    
                    
                    currentItem.subitems.push(result);
                    
                }
            }
            
            
        });

        

        renderOrders(objeto);
    }
        

      
    }
 // Função para ordenar pedidos por cliente
    function sortOrdersByCliente(data) {
      data.sort((a, b) => {
        const clienteA = a.item.cliente.toLowerCase();
        const clienteB = b.item.cliente.toLowerCase();
        return clienteA.localeCompare(clienteB);
      });
    }
    // Função para renderizar as tabelas
    function renderOrders(data) {
      // Ordenar antes de renderizar
      sortOrdersByCliente(data);
      //arrayUnico.push[currentItem.subitems]
      
      const container = document.getElementById('orders-container');
      let html = '';

      data.forEach((order, index) => {
        html += `
          <label class="pedido-section" for="order-${order.item.pedido}">
            <div class="checkbox-container">
              <input type="checkbox" id="order-${order.item.pedido}" value="${order.item.pedido}">
              <label ><strong>${order.item.pedido} - ${order.item.cliente}</strong> <small>${order.item.data_venda}</small></label>
            </div>
            <div>
        `;
        
        order.subitems.forEach(subitem => {
          html += `
              <p><strong>${subitem.qtd} . </strong> ${subitem.model} <strong>${subitem.size}</strong> - ${subitem.cloth}</p>
          `;
        });
        
        html += `
              </div>
          </label>
        `;
      });

      container.innerHTML = html;
    }

    // Função para deletar pedidos selecionados
    function deleteSelectedOrders() {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const pedidosToDelete = Array.from(checkboxes).map(cb => cb.value);

      // Filtrar os pedidos, mantendo apenas os não selecionados
     objeto =objeto.filter(order => !pedidosToDelete.includes(order.item.pedido));

      // Re-renderizar as tabelas
      renderOrders(objeto);
    }
    





function toggleCheckboxes() {
            // Seleciona todos os checkboxes da página
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            // Inverte o estado de cada checkbox
            checkboxes.forEach(checkbox => {
                checkbox.checked = !checkbox.checked;
            });
        }



function render(data){
    const container = document.getElementById('orders-container');
    let html = '';
    console.log(data)
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