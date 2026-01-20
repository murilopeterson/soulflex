export default class IDB {
    constructor(dbName, storeName, schema = {}) {
        this.dbName = dbName;
        this.storeName = storeName;

        this.schema = {
            keyPath: schema.keyPath || 'id',
            autoIncrement: schema.autoIncrement || false,
            indexes: schema.indexes || []
        };

        this.db = null;
    }

    open() {
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(this.dbName, 1);

            req.onerror = () => reject(req.error);

            req.onsuccess = () => {
                this.db = req.result;
                resolve(this.db);
            };

            req.onupgradeneeded = (e) => {
                const db = e.target.result;

                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, {
                        keyPath: this.schema.keyPath,
                        autoIncrement: this.schema.autoIncrement
                    });

                    this.schema.indexes.forEach(idx => {
                        store.createIndex(idx.name, idx.key, idx.options || {});
                    });
                }
            };
        });
    }

    async run(mode, action) {
        const db = this.db || await this.open();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], mode);
            const store = tx.objectStore(this.storeName);
            const req = action(store);

            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
        });
    }

    save(obj) {
        return this.run('readwrite', store => store.put(obj));
    }

    async saveAll(dataArray) {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return [];
        }
        
        const db = await this.connect();
        
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(this.storeName, 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const results = [];
            
            transaction.oncomplete = () => resolve(results);
            transaction.onerror = (event) => reject(event.target.error);

            dataArray.forEach(data => {
                const request = store.put(data);
                
                request.onsuccess = (e) => {
                    results.push(e.target.result);
                };
            });
        });
    }

    get(id) {
        return this.run('readonly', store => store.get(id));
    }

    getAll() {
        return this.run('readonly', store => store.getAll());
    }

    delete(id) {
        return this.run('readwrite', store => store.delete(id));
    }
}

/* const clientesDB = new IDB("MeuDB", "clientes", {
    keyPath: "id",
    autoIncrement: true,
    indexes: [
        { name: "nome_idx", key: "nome" },
        { name: "email_idx", key: "email", options: { unique: true } }
    ]
});

(async () => {
    const novoCliente = {
        nome: "Murilo P",
        email: "murilo@example.com",
        cidade: "São Paulo"
    };

    const idGerado = await clientesDB.save(novoCliente);

    console.log("Cliente salvo com ID:", idGerado);
})();


(async () => {
    const dados = await clientesDB.getAll();
    console.log(dados);
})(); */