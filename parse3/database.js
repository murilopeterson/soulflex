class DB {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    openDB(storesConfig, callback) {
        let request = indexedDB.open(this.dbName, this.version);

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            storesConfig.forEach(store => {
                if (!db.objectStoreNames.contains(store.nome)) {
                    let objectStore = db.createObjectStore(store.nome, { keyPath: store.keyPath, autoIncrement: store.autoIncrement || false });
                    store.indices?.forEach(indice => {
                        objectStore.createIndex(indice.nome, indice.campo, { unique: indice.unico || false });
                    });
                }
            });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log(`Banco ${this.dbName} aberto com sucesso.`);
            if (callback) callback();
        };

        request.onerror = (event) => {
            console.error("Erro ao abrir o banco:", event.target.error);
        };
    }

    create(storeName, data, callback) {
        let transaction = this.db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.add(data);

        request.onsuccess = () => {
            console.log("Registro adicionado:", data);
            if (callback) callback(request.result);
        };

        request.onerror = (event) => {
            console.error("Erro ao adicionar:", event.target.error);
        };
    }

    read(storeName, key, callback) {
        let transaction = this.db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        let request = store.get(key);

        request.onsuccess = () => {
            callback(request.result);
        };

        request.onerror = (event) => {
            console.error("Erro ao buscar:", event.target.error);
        };
    }

    readAll(storeName, callback) {
        let transaction = this.db.transaction(storeName, "readonly");
        let store = transaction.objectStore(storeName);
        let request = store.getAll();

        request.onsuccess = () => {
            callback(request.result);
        };

        request.onerror = (event) => {
            console.error("Erro ao buscar todos:", event.target.error);
        };
    }

    update(storeName, data, callback) {
        let transaction = this.db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.put(data);

        request.onsuccess = () => {
            console.log("Registro atualizado:", data);
            if (callback) callback(request.result);
        };

        request.onerror = (event) => {
            console.error("Erro ao atualizar:", event.target.error);
        };
    }

    delete(storeName, key, callback) {
        let transaction = this.db.transaction(storeName, "readwrite");
        let store = transaction.objectStore(storeName);
        let request = store.delete(key);

        request.onsuccess = () => {
            console.log("Registro removido:", key);
            if (callback) callback();
        };

        request.onerror = (event) => {
            console.error("Erro ao remover:", event.target.error);
        };
    }
}


/* const dbManager = new DB("GerenciamentoProducao", 1);

const storesConfig = [
    { nome: "clientes", keyPath: "id", autoIncrement: true, indices: [{ nome: "telefone", campo: "telefone" }] },
    { nome: "pedidos", keyPath: "id", autoIncrement: true, indices: [{ nome: "clienteId", campo: "clienteId" }] },
    { nome: "producao", keyPath: "id", autoIncrement: true, indices: [{ nome: "status", campo: "status" }] }
];

dbManager.openDB(storesConfig, () => {
    // Adicionando um cliente
    dbManager.create("clientes", { nome: "João", telefone: "11987654321" });

    // Buscando todos os clientes
    dbManager.readAll("clientes", (clientes) => {
        console.log("Clientes cadastrados:", clientes);
    });

    // Atualizando um cliente
    dbManager.read("clientes", 1, (cliente) => {
        if (cliente) {
            cliente.telefone = "11999999999";
            dbManager.update("clientes", cliente);
        }
    });

    // Removendo um cliente
    dbManager.delete("clientes", 1);
}); */
