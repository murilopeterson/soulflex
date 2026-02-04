import Reader from "./reader.js";
/* import IDB from "./IDB.js";
import Util from "./Util.js";
import StringRegistry from "./REG.js"
import Storage from "./Storage.js" */

class App{

    constructor(){

        //CHECK Storage
        //UPDATE ORDERLIST
    

        this.file = new Reader("file", this.onFileChange.bind(this))
        //this.onFileChange()
    }


    onFileChange(data) {
        console.log(data)
    }
}

new App()