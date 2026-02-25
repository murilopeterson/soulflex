class App{
    constructor(){
        this.init()
    }

    init(){

    }
}

class Report{
    constructor(report){
        this.reportParse()
    }

    reportParse(report){
        if(!report) return

        let object = {}

        report.forEach(element => {
            this.rowParse(element)
        });

        return object
    }
}