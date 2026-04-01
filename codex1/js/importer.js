export default class FileImporter {
    constructor(input) {
        this.input = input;
    }

    async getFiles(target = null) {
        const files = Array.from(this.input.files);
        const data = await Promise.all(files.map(f => this.process(f, target)));
        return data.length === 1 ? data[0] : data;
    }

    async process(file, target) {
        const isXls = file.name.match(/\.(xlsx|xls|csv)$/);
        const content = await this.read(file, isXls);
        return this.parse(content, isXls, target);
    }

    read(file, isXls) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(this.format(e.target.result, isXls));
            reader.onerror = () => reject(reader.error);
            this.triggerRead(reader, file, isXls);
        });
    }

    triggerRead(reader, file, isXls) {
        if (isXls) return reader.readAsArrayBuffer(file);
        reader.readAsText(file);
    }

    format(result, isXls) {
        if (isXls) return new Uint8Array(result);
        return result;
    }

    parse(content, isXls, target) {
        if (!isXls) return content;
        const wb = XLSX.read(content, { type: 'array' });
        const name = this.getSheetName(wb, target);
        return XLSX.utils.sheet_to_json(wb.Sheets[name]);
    }

    getSheetName(wb, target) {
        const names = wb.SheetNames;
        const exists = target && names.includes(target);
        if (exists) return target;
        return names[0];
    }
}