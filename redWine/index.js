const childExec = require("child_process").exec;
const http = require('http');
const util = require('util');
const fs = require('fs');
const os = require('os');
const UrlParser = require('url');
const iwlist = require('wireless-tools/iwlist');
const moment = require('moment');

const onoffnet = require('./onoffnet');

let theApp = {
    version: {
        major: 1,
        miner: 0,
        rev: 2
    },
    port: 20310,
    udp_port : 20020
};

// console.log(process.argv.length)
// console.log(process.argv)

if(process.argv.length >=3 ) {
    theApp.port = parseInt(process.argv[2])
}

theApp.http_server = http.createServer(
    function (req, res) {
        switch (req.method) {
            case 'GET':
                process_get(req, res);
                break;
            case 'POST':
                process_post(req, res);
                break;
        }
    }
);

//start rest server
theApp.http_server.listen(theApp.port);
console.log(`start Red Wine version ${theApp.version.major}.${theApp.version.miner}.${theApp.version.rev} , port ${theApp.port}`);

//start onoff server
theApp.onoffnetApp = new onoffnet(
    {
        host: {
            port: theApp.udp_port
        }
    }
);


//get 처리 해주기
async function process_get(req, res) {

    let _urlObj = UrlParser.parse(req.url, true);

    //     res.writeHead(200, {
    //         'Content-Type': 'text/plain',
    // //      'Content-Type': 'application/json',
    //         'Access-Control-Allow-Origin': '*',
    //         'Access-Control-Allow-Methods': 'POST',
    //         'Access-Control-Max-Age': '1000'
    //     });

    let header = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '1000',
        'Content-Type': 'Application/json'
    };

    switch (_urlObj.pathname) {
        //http://localhost:3010/test?msg=hello&foo=world
        case '/test':
            {
                res.writeHead(200, header);
                res.end(JSON.stringify({
                    result: 'ok',
                    data: _urlObj
                })
                );
            }
            break;

        case '/rest/sysinfo':
            {
                res.writeHead(200, header);
                // let _url = urlParser.parse(req.url,true);

                let result = {
                    version: theApp.version,
                    os: {
                        platform: os.platform(),
                        version: os.release()
                    },

                }

                console.log(result)

                res.end(JSON.stringify(result));
            }
            break;

        case '/rest/exec':
            {
                res.writeHead(200, header);

                let _url = _urlObj;

                // console.log('try cmd : ',_url.query.cmd)
                console.log(`try cmd : ${_url.query.cmd} , at : ${new Date()}`)
                
                childExec(_url.query.cmd, (err, stdout, stderr) => {

                    let result = {
                        err: err,
                        stdout: stdout,
                        stderr: stderr
                    }
                    res.end(JSON.stringify(result));
                })
            }
            break;
        case '/rest/setDate':
            {
                //setDate?d=20190830&t=131003
                res.writeHead(200, header);

                let _url = _urlObj;

                let result = {
                    date: _url.query.d,
                    time: _url.query.t
                }

                let _date = _url.query.d;
                let _time = _url.query.t;
                // _date = spliceSplit(_date,4,1,'-')
                console.log(_date,_time)
                // console.log(_time.length)
                // if(_time.length < 6) {
                //     _time = "0" + _time
                // }

                let _tms = moment(_date + ':' + _time,"YYYYMMDD:hmmss")
                console.log(_tms)

                let _cmd = `sudo date -s '${_tms.format("YYYY-MM-DD HH:mm:ss")}'`;
                console.log('set Date : ',_cmd)
                //date -s '2019-01-25 12:34:56'
                if (os.platform() === 'linux') {

                    childExec(_cmd, (err, stdout, stderr) => {

                        let result = {
                            err: err,
                            stdout: stdout,
                            stderr: stderr
                        }
                        res.end(JSON.stringify(result));

                    })

                }
                else {
                    res.end(JSON.stringify({
                        err: `os platform ${os.platform()} not surported`
                    }));
                }
            }
            break;
        case '/rest/scanAp':
            {
                res.writeHead(200, header);

                // let result = urlParser.parse(req.url,true);

                let interfaceName = _urlObj.query.interface

                iwlist.scan(interfaceName, (err, network) => {

                    let _rst = ''

                    if (err) {
                        console.log(JSON.stringify(err))
                        _rst = JSON.stringify(err)
                        res.end(_rst)
                    }
                    else {
                        console.log(JSON.stringify(network))
                        res.end(JSON.stringify(network))
                    }
                });
            }
            break;
        case '/rest/onoff':
            {
                res.writeHead(200, header);

                let _url = _urlObj

                let _args = {
                    pin: _url.query.pin,
                    value: _url.query.value
                }

                // console.log(_args)

                theApp.onoffnetApp.writeGpio({
                    port: parseInt(_args.pin),
                    value: parseInt(_args.value)
                });

                res.end(JSON.stringify({ result: 'ok' }));
            }
            break;

        default:
            res.writeHead(200, header);
            res.end(JSON.stringify({
                result: 'ok',
                msg: 'it is red wine server ' + theApp.version
            }));
            break;
    }
}

function process_post(req, res) {

    var result = UrlParser.parse(req.url, true);

    var body_data = '';

    console.log("incomming post data !");

    //포스트는 데이터가 조각조각 들어 온다.
    req.on('data', function (data) {
        body_data += data;
        console.log(data);
    });

    //데이터를 다 받았으면
    req.on('end', function () {
        res.writeHead(200, {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Max-Age': '1000'
        });

        //POST 경우는 파싱전 인코딩된 문자 되돌려야한다.
        body_data = decodeURIComponent(body_data);

        console.log("-------------- complete -----------------");
        console.log(body_data)

        res.end(JSON.stringify({
            result: 'ok',
            msg: 'it is http posy test server ' + theApp.version
        }));

    });
}