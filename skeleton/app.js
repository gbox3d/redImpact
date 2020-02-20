const fs = require('fs')

let theApp = {
    version: {
        major: 1,
        minor: 0,
        rev: 1
    },
    name : "skeleton",
    setup: function () {
        return new Promise((resolve, reject) => {


            if (process.argv.length >= 3) {
                this.rest_port = parseInt(process.argv[2]);
                resolve(this)
            }
            else {
                console.log('usage : node index.js <rest-port>')
                //this.exit(0)
                reject({message : "check argument"})
            }

            

        })
    }

}



module.exports = theApp