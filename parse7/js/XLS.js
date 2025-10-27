export default class XLS {
    constructor(target) {
        this.data = null;
        this.target = target.files[0];
        this.read();
    }

    read() {
        return new Promise((resolve, reject) => {
            const file = this.target;
            const reader = new FileReader();

            reader.onload = (e) => {
                try {

                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    const firstSheet = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheet];

                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    this.parse(jsonData);
                    resolve(this.data);

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(reader.error);

            reader.readAsArrayBuffer(file);
        });
    }

    parse(json) {

        this.data = json.map(obj => ({
            row: Object.values(obj)
        }));
        
    }

    getData() {
        return this.data;
    }

}

