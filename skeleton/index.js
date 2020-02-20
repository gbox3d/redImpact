const http = require('http');
const os = require('os');
const UrlParser = require('url');

const theApp = require('./app')

theApp.setup()
    .then((_) => {

        let http_server = http.createServer(
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

        http_server.listen(this.rest_port);
        console.log(`start ${_.name} version ${_.version.major}.${_.version.minor}.${_.version.rev} , port ${_.rest_port}`);

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

                        }

                        console.log(result)

                        res.end(JSON.stringify(result));
                    }
                    break;
                default:
                    res.writeHead(200, header);
                    res.end(JSON.stringify({
                        result: 'ok',
                        msg: ` ${theApp.name} version ${theApp.version} `
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

    })
    .catch(e=> {
        console.log(e)
    })

