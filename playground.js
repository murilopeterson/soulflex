//criar tabelas no html

//
        const container = document.getElementById('list');
      
        // Criar elemento tabela
        const tabela = document.createElement('table');
        
        // Criar cabeçalho
        const cabecalho = document.createElement('thead');
        const linhaCabecalho = document.createElement('tr');
        const chaves = Object.keys(data[0]); // Pega as chaves do primeiro objeto
        chaves.forEach(chave => {
            const th = document.createElement('th');
            th.textContent = chave.charAt(0).toUpperCase() + chave.slice(1); // Capitaliza a primeira letra
            linhaCabecalho.appendChild(th);
        });
        cabecalho.appendChild(linhaCabecalho);
        tabela.appendChild(cabecalho);
        
        // Criar corpo da tabela
        const corpo = document.createElement('tbody');
        data.forEach(item => {
            const linha = document.createElement('tr');
            chaves.forEach(chave => {
            const celula = document.createElement('td');
            celula.textContent = item[chave];
            linha.appendChild(celula);
            });
            corpo.appendChild(linha);
        });
        tabela.appendChild(corpo);
        
        // Adicionar tabela ao container
        container.appendChild(tabela);