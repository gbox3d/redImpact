
const assert = require('assert');
// import moment from "moment";
const moment = require('moment');
// import '../lib/collection'
// import fetch from "node-fetch";
const fetch = require('node-fetch');
var { CronJob } = require('cron');

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

const dgram = require("dgram");
const udp_socket = dgram.createSocket("udp4");

const esm_require = require("esm")(module);

const { randWithRangeInteger } = esm_require('../libs/util.js')

console.log( "test",randWithRangeInteger(1,5))

let theApp = {
    version: {
        major: 1,
        miner: 0,
        rev: 4
    },
    selector: {
        name: "schedule"
    },
    LogicUnit: {
        cron: {}

    },
    db_name: "redskull",
    collection_name: "timeChecker",
    mongo_url: 'mongodb://localhost:27017',
    MongoDB: MongoClient
}

const dbClient = new MongoClient(theApp.mongo_url, { useUnifiedTopology: true });

udp_socket.on('message', (_) => {
    console.log(_)
})

//high low 로직 처리 
function ApplyHighLowLogic(_logicUnit) {
    let _config = theApp.config;
    let _current = parseInt(moment().format('HHmm'));
    let _on = parseInt(_logicUnit.on_time);
    let _off = parseInt(_logicUnit.off_time);

    let _url = `http://${_config.remote.ip}:${_config.remote.port}/rest/exec?cmd=`;

    if (_off > _on) {
        //on 상태
        if (_on <= _current && _off >= _current) {
            //_pkt.v = _port.activeVal ? 1 : 0;
            _url += _logicUnit.on_command

        }
        else { //off
            _url += _logicUnit.off_command

        }
    }
    else {
        //on 상태
        if (_on <= _current || _off >= _current) {

            _url += _logicUnit.on_command
        }
        else { //off
            _url += _logicUnit.off_command
        }

    }

    fetch(_url)
        .then(_ => _.json())
        .then(_ => {
            console.log(_)
        })
        .catch(e => {
            console.log(e)
        });
}

function startLoop(_) {

    // console.log(theApp)
    // let loopFsm = 'normal';
    console.log('start loop....');

    function _timerLoop() {

        let _config = theApp.config;
        let _lu_highlow_list = theApp.LogicUnit.highLow;

        //high low 로직 처리
        _lu_highlow_list.forEach(ApplyHighLowLogic);

        setTimeout(_timerLoop,
            _config.loopDelay
        );
    }

    setTimeout(_timerLoop,
        2000
    );

}

///////////////// get config data
theApp.getConfigData = function () {

    return (new Promise((resolve, reject) => {

        theApp.colConfigInst.findOne({ name: "config" })
            .then(_ => {
                resolve(_.system)
            })
            .catch(e => reject(e))
    }))

}

///////////////// set config data
theApp.setConfigData = function (_config) {

    return (new Promise((resolve, reject) => {

        theApp.colConfigInst.updateOne({ name: "config" },
            {
                $set: {
                    system: _config
                }
            })
            .then(_ => {
                theApp.config = _config
                resolve(_)
            })
            .catch(e => reject(e))
    }))

}

// scedule apis
theApp.addSchedule = (_item) => (new Promise((resolve, reject) => {

    theApp.colConfigInst.insertOne(_item)
        .then(_ => {
            resolve(_)
        })
        .catch(e => {
            console.log(e)
        })
}));
theApp.removeSchedule = (_id) => theApp.colConfigInst.deleteOne({ _id: MongoDB.ObjectId(_id) });
theApp.updateSchedule = (_id, _schedule) => theApp.colConfigInst.updateOne({ _id: MongoDB.ObjectId(_id) }, { $set: _schedule });
theApp.getSchedule = () => theApp.colConfigInst.find({}).toArray();


///////////////// set up
theApp.setup = () => new Promise((resolve, reject) => {

    let collection, dbInst;

    (new Promise((resolve, reject) => {
        //DB 연결
        console.log(`try to connect db ${theApp.mongo_url}`)
        dbClient.connect()
            .then(_client => {
                console.log(`connect ok ${theApp.mongo_url}`)
                theApp.dbInst = dbInst = _client.db(theApp.db_name);
                theApp.colConfigInst = collection = theApp.dbInst.collection(theApp.collection_name);
                resolve()
            })
            .catch(e => {
                reject(e)
            })

    }))
        .then(_ => collection.find({ name: "config" }).count())
        .then(_count => new Promise((resolve, reject) => {

            // console.log('count' + _count)
            if (_count == 0) {
                //create , 데이터가 없다면 
                console.log('now create config data')
                collection.insertOne(
                    {
                        name: "config",
                        type: 'system',
                        system: {
                            remote: { //wine 서버 주소 정보
                                ip: "localhost",
                                port: 20310,
                                udp_port: 20020
                            },
                            loopDelay: 60000
                        }
                    }
                )
                    .then(_ => {
                        console.log(_.insertedCount)
                        resolve()
                    });
            }
            else {
                //find 
                //기존 데이터가 있다면
                console.log('now find config data')
                resolve()
            }

        }))
        .then(_ => new Promise((resolve, reject) => {
            //resolve();
            collection.findOne({ name: "config" })
                .then(data => {
                    // console.log(data)
                    theApp.config = data.system;
                    resolve(data);
                })
        }))
        .then(_ => theApp.colConfigInst.find({ type: "high-low" }).toArray())
        .then(_ => {
            console.log('get ok... high low logic', _)
            theApp.LogicUnit.highLow = _;

            return theApp.colConfigInst.find({ type: "simple" }).toArray();
        })
        .then(_ => {
            console.log('get ok... simple logic', _)

            theApp.LogicUnit.simple = _;

            let _config = theApp.config;
            let _jobs = {}

            _.forEach((item) => {

                let _cronCode = `${item.timeTrigger.substr(2, 2)} ${item.timeTrigger.substr(0, 2)} * * *`
                console.log(_cronCode);

                const job = new CronJob(_cronCode, function () {
                    let _url = `http://${_config.remote.ip}:${_config.remote.port}/rest/exec?cmd=${item.command}`;
                    console.log(_url)
                    fetch(_url)
                        .then(_ => _.json())
                        .then(_ => {
                            console.log(_)
                        })
                        .catch(e => {
                            console.log(e)
                        });
                });
                job.start();
                _jobs[item.name] = job
            })

            theApp.LogicUnit.cron.simpleLogicJobs = _jobs;

            return theApp.colConfigInst.find({ type: "looper" }).toArray();
        })
        .then(_ => {
            let _config = theApp.config;
            let _jobs = {}
            console.log("get ok... looper logic", _);

            _.forEach(item => {
                let _loopDelay = parseInt(item.loopDelay);
                let _h = Math.floor(_loopDelay / 60)
                let _m = _loopDelay % 60

                let _cronCode = `0/${_m} * * * *`
                if (_h > 0) {
                    _cronCode = `0 0/${_h} * * *`
                }

                const job = new CronJob(_cronCode, function () {

                    let _extraDelay = (_m * 1000) + (randWithRangeInteger(0, 300) * 100);
                    console.log('extra delay :' , _extraDelay)

                    setTimeout(() => {
                        let _url = `http://${_config.remote.ip}:${_config.remote.port}/rest/exec?cmd=${item.command}`;
                        console.log(`looper do fetch :$_{url} at: ${new Date()}`)

                        fetch(_url)
                            .then(_ => _.json())
                            .then(_ => {
                                console.log(_)
                            })
                            .catch(e => {
                                console.log(e)
                            });

                    }, _extraDelay);

                });
                job.start();
                _jobs[item.name] = job

            });

            theApp.LogicUnit.cron.looperJobs = _jobs;

        })
        .then(_ => {
            //complete
            console.log('setup done')

            //loop start
            startLoop();
            // console.log(_)

            resolve(_)

        })
        .catch(e => {
            //error
            console.log(e);
            reject(e)

        });
})


module.exports = theApp
