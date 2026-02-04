export default class Storage {
  constructor(dbName) {
    this.base = dbName;
    this.data = this.readAll();
  }

  readAll() {
    return JSON.parse(localStorage.getItem(this.base)) ?? [];
  }

  save() {
    localStorage.setItem(this.base, JSON.stringify(this.data));
    this.data = this.readAll();
    return this;
  }

  insert(value) {
    if (!this.data || Array.isArray(this.data)) {
        this.data = {};
    }

    const keys = Object.keys(this.data).map(Number).filter(n => !isNaN(n));
    const maxId = keys.length > 0 ? Math.max(...keys) : 0;
    const nextId = (maxId + 1).toString();

    const isObject = typeof value === 'object' && value !== null;
    this.data[nextId] = isObject ? value : String(value || "").trim();
    
    this.save();
    return nextId;
  }

  upsert(value, key = null) {
    if (!this.data || Array.isArray(this.data)) {
        this.data = {};
    }

    const isObject = typeof value === 'object' && value !== null;

    const existingId = Object.keys(this.data).find(idKey => {
        const savedValue = this.data[idKey];
        if (key && isObject && typeof savedValue === 'object') {
            return savedValue[key] === value[key];
        }
        return JSON.stringify(savedValue) === JSON.stringify(value);
    });

    if (existingId) return existingId;

    return this.insert(value);
  }

    create(data) {
        this.data = data;
        this.save();
        return this.data.length - 1;
    }

    read(index) {
        return this.data[index];
    }

    update(index, data) {
        if (!this.data || Array.isArray(this.data)) {
            this.data = {};
        }

        this.data[index] = String(data || "").trim();
        this.save();

        return index;
    }

    delete(index) {
        this.data.splice(index, 1);
        this.save();
        return this;
    }

    deleteAll() {
        this.data = [];
        this.save();
        return this;
    }

    where(callback) {
        return this.data.filter(callback);
    }

    filterBy(key, value) {
        return this.data.filter(item => 
            String(item[key] || '').toLowerCase().includes(String(value).toLowerCase())
        );
    }

    sortBy(key, desc = false) {
        const sorted = [...this.data].sort((a, b) => {
            const valA = String(a[key] || '').toLowerCase();
            const valB = String(b[key] || '').toLowerCase();
            return valA.localeCompare(valB);
        });
        return desc ? sorted.reverse() : sorted;
    }

}
