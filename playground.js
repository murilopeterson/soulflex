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



/*         cliente 1 - n pedidos

        pedido 1 - n items


        cliente(id, nome, rota, busca, pes, rank, status, obs, endereco)

        pedido(id, id cliente, venda, faturado, vendedor, status, prioridade, obs)
        
        item(id, id pedido, caixa( tipo, tamanho, altura), roupa, classe, kit, status, obs)
        */





class Row{
    constructor(row){
        this.cells = row

    }
    parse(){

    }
    isOrder(){}
    isItem(){}
    isPayment(){}
    isObs(){}
    isHeader(){}
}

class Payment{
    constructor(type, value, discount){

    }
}

class Order {
    constructor({id, saleDate, invoiceDate, salesman, items = [], obs = null, ref =null}){

    }
}

class Item {
    constructor(model, cloth, qty, price){

    }
}

class Soul extends Model{
    
}

class Gran extends Model{
    
}

class Gold extends Model{

}

class Lux extends Model{
    
}

class Cashmere extends Model{
    
}

class Prime extends Model{

}

class Diamond extends Model {

}

class Model {
    constructor(type, size){
        
    }

}

class Box extends Type{

}

class Bau extends Type{

}

class Bicama extends Type {

}

class Type {
    constructor(type){

    }
}

class Kit{
    constructor(type, size, color, qty){

    }
}

class Cloth {
    constructor(material, color){

    }
}

class Client {
    constructor(name, zone){

    }
}





[
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP1",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP1",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP1",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP3",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP3",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP5",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP5",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "158X198",
        "roupa": "PP5",
        "quantidade": 3,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "193X203",
        "roupa": "PP1",
        "quantidade": 1,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GRAN",
        "tamanho": "193X203",
        "roupa": "PP3",
        "quantidade": 1,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7434",
        "venda": "20/06/25",
        "prazo": "10/07/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BAU",
        "modelo": "    GOLD",
        "tamanho": "158X198",
        "roupa": "LINHO CINZA",
        "quantidade": 1,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": ""
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP5",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP5",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP3",
        "quantidade": 4,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP3",
        "quantidade": 4,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP3",
        "quantidade": 4,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP3",
        "quantidade": 4,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP1",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "158X198X28",
        "roupa": "PP1",
        "quantidade": 2,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    },
    {
        "op": "7661",
        "venda": "31/07/25",
        "prazo": "11/08/2025",
        "loja": "SUPER SONO RA",
        "tipo": "BOX",
        "modelo": "  GRAN",
        "tamanho": "193X203X28",
        "roupa": "PP3",
        "quantidade": 6,
        "rota": "NE30",
        "status": "",
        "produtor": "",
        "entrega": "",
        "observacao": "URGENTE"
    }