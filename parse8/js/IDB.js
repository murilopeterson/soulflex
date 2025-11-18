export default class IDB {
    constructor(dbName, storeName, keyPath = 'id') {
        this.dbName = dbName;
        this.storeName = storeName;
        this.keyPath = keyPath;
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
                    db.createObjectStore(this.storeName, { keyPath: this.keyPath });
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
