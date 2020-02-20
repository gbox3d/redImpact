const http = require('http');
const os = require('os');
const UrlParser = require('url');


const theApp = require('./app')

// console.log(theApp)

let restApiPort = 20320;

if (process.argv.length >= 3) {
    restApiPort = parseInt(process.argv[2])
}

theApp.setup()
    .then(
        (_) => {

            // let _settings = _
            console.log('system config data ', _)

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


            console.log(`start timeChecker server , Version ${theApp.version.major}.${theApp.version.miner}.${theApp.version.rev} , port ${restApiPort}`);
            theApp.http_server.listen(restApiPort);


            //get 처리 해주기
            function process_get(req, res) {

                let _urlObj = UrlParser.parse(req.url, true);
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
                                node: process.versions,
                                os: {
                                    platform: os.platform(),
                                    version: os.release()
                                },
                                version: theApp.version
                            }

                            console.log(result)

                            res.end(JSON.stringify(result));
                        }
                        break;
                    case '/rest/getConfig':
                        {
                            res.writeHead(200, header);

                            theApp.getConfigData()
                                .then(_ => {
                                    res.end(JSON.stringify({
                                        result: 'ok',
                                        config: _
                                    }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                })

                        }
                        break;
                    case '/rest/setConfig':
                        {
                            res.writeHead(200, header);

                            console.log(_urlObj.query.data)
                            let _config = JSON.parse(_urlObj.query.data)

                            theApp.setConfigData(_config)
                                .then(_ => {
                                    res.end(JSON.stringify({ result: 'ok' }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                })
                        }
                        break;
                    case '/rest/addSchedule':
                        {
                            res.writeHead(200, header);

                            // console.log(_urlObj.query.data)
                            let _item = JSON.parse(_urlObj.query.data)

                            theApp.addSchedule(_item)
                                .then(_ => {
                                    res.end(JSON.stringify({ result: 'ok' }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                })

                        }
                        break;
                    case '/rest/getSchedule':
                        {
                            res.writeHead(200, header);
                            // let _item = JSON.parse(_urlObj.query.data)

                            theApp.getSchedule()
                                .then(_ => {
                                    res.end(JSON.stringify({ result: 'ok', schedules: _ }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                });
                        }
                        break;
                    case '/rest/updateSchedule':
                        {
                            let _id = _urlObj.query.itemId
                            let _schedule = _urlObj.query.schedule

                            console.log(_schedule)

                            res.writeHead(200, header);

                            theApp.updateSchedule(_id, JSON.parse(_schedule))
                                .then(_ => {
                                    res.end(JSON.stringify({ result: 'ok' }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                });

                        }
                        break;
                    case '/rest/removeSchedule':
                        {
                            res.writeHead(200, header);
                            let _id = _urlObj.query.itemId

                            theApp.removeSchedule(_id)
                                .then(_ => {
                                    res.end(JSON.stringify({ result: 'ok' }));
                                })
                                .catch(e => {
                                    res.end(JSON.stringify({
                                        result: 'err',
                                        err: e
                                    }))
                                });

                        }
                        break;

                    default:
                        res.writeHead(200, header);
                        res.end(JSON.stringify({
                            result: 'ok',
                            msg: `no rest cmd : ${req.url}`
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

        }
    )
    .catch(e => {
        console.log(e)
    })
