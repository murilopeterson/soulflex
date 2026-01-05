export default class Database {
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

  upsert(item, key = 'id') {
    const data = JSON.parse(localStorage.getItem(this.key)) || {};
    const isObject = typeof value === 'object' && value !== null;
    
    const existingEntry = Object.entries(data).find(([id, val]) => {
      if (key && isObject && typeof val === 'object') {
        return val[key] === value[key];
      }
      return JSON.stringify(val) === JSON.stringify(value);
    });

    if (existingEntry && id === null) {
      return existingEntry[0];
    }

    const idToUse = id !== null ? id : (Object.keys(data).length + 1);
    
    data[idToUse] = isObject ? value : String(value || "").trim();
    localStorage.setItem(this.key, JSON.stringify(data));

    return String(idToUse);
    if (typeof item !== 'object') {
      item = { [key]: item };
    }

    const index = this.data.findIndex(elem => elem[key] === item[key]);

    if (index === -1) {
      this.data.push(item);
      this.save();
      return this.data.length - 1;
    } else {
      this.data[index] = { ...this.data[index], ...item };
      this.save();
      return index;
    }
  }

  insert(value) {
    const index = this.data.indexOf(value);

    if (index === -1) {
      this.data.push({[this.data.length + 1]:value});
      this.save();
      return this.data.length - 1;
    }

    return index;
  }

    create(data) {
        this.data.push(data);
        this.save();
        return this.data.length - 1;
    }

    read(index) {
        return this.data[index];
    }

    update(index, data) {
        if (this.data[index]) {
            this.data[index] = { ...this.data[index], ...data };
            this.save();
        }
        return this;
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



