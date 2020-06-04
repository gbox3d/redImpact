const fs = require('fs')

let theApp = {
    version: {
        major: 1,
        minor: 0,
        rev: 1
    },
    name : "skeleton",
    setup: function ({
        restPort
    }) {
        return new Promise((resolve, reject) => {
            if(restPort === undefined) 
            {
                console.log('usage : node index.js <rest-port>')
                reject({message : "check argument"})
            }
            else {
                this.restPort = restPort
                resolve(this)
            }

        })
    }

}



module.exports = theApp