export default class Database {
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
            const request = indexedDB.open(this.dbName);

            request.onerror = () => reject(request.error);

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (e) => {
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
            
            const result = action(store, tx);

            if (result instanceof IDBRequest) {
                result.onsuccess = () => resolve(result.result);
                result.onerror = () => reject(result.error);
            } else {
                tx.oncomplete = () => resolve(result);
                tx.onerror = () => reject(tx.error);
            }
        });
    }

    save(obj) {
        return this.run('readwrite', store => store.put(obj));
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

    saveAll(items) {
        return this.run('readwrite', (store) => {
            items.forEach(item => store.put(item));
            return true;
        });
    }

    async upsert(data) {
        const db = await this._getDB();
        return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(data);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        });
    }

    async sync(webAppUrl, sheetId, tabName) {
        try {
        const localData = await this.readAll();
        
        const response = await fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            sheetId: sheetId,
            tabName: tabName,
            data: localData
            })
        });

        return { success: true, count: localData.length };
        } catch (error) {
        return { success: false, error: error.message };
        }
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