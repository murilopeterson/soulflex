export default class XLS {
    constructor(inputElement) {
        this.file = inputElement.files[0];
    }

    async read() {
        const buffer = await this._readFile(this.file);
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheet = this._firstSheet(workbook);
        return this._toJson(sheet);
    }


    _readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(new Uint8Array(e.target.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    _firstSheet(workbook) {
        const name = workbook.SheetNames[0];
        return workbook.Sheets[name];
    }

    _toJson(sheet) {
        const json = XLSX.utils.sheet_to_json(sheet);

        return json.map(row => ( Object.values(row) ));

    }
}
