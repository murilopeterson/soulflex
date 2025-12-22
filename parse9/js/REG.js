export default class StringRegistry {
    constructor(key = 'temp') {
        this.key = key;
    }

    getOrRegister(value, key = null, id = null) {
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
    }

    getValueById(id) {
        const data = JSON.parse(localStorage.getItem(this.key)) || {};
        return data[id] || null;
    }

    getIdByValue(value, key = null) {
        const data = JSON.parse(localStorage.getItem(this.key)) || {};
        const isObject = typeof value === 'object' && value !== null;

        const found = Object.entries(data).find(([id, val]) => {
            if (key && isObject && typeof val === 'object') {
                return val[key] === value[key];
            }
            return JSON.stringify(val) === JSON.stringify(value);
        });
        return found ? found[0] : null;
    }

    clear() {
        localStorage.removeItem(this.key);
    }
}