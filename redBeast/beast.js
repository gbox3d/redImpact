// const fetch = require('node-fetch');
// const dgram = require("dgram");

import fetch from 'node-fetch'
import dgram from 'dgram'

// const { execSync,exec } = require("child_process");
import { exec } from 'child_process'


const udp_socket = dgram.createSocket("udp4");
const header = 20200531

function setup({ beastId, remoteIp, remotePort, restPort }) {

    console.log(`start beast client remote ip : ${remoteIp} ,port ${remotePort} , rest ${restPort} , id : ${beastId}`)

    try {
        udp_socket.on("message", async function (msg, rinfo) {

            let header = msg.readUInt32LE(0);
            let code = msg.readUInt8(4)
            let data = msg.slice(8, msg.length)

            console.log(`header: ${header} , code:${code}`)

            try {
                switch (code) {
                    case 1: //test 
                        {
                            let _json = JSON.parse(data.toString('utf-8'))
                            console.log(_json)

                        }
                        break;
                    case 2:
                        {
                            let pathname_len = data.readUInt8(0)
                            let pathname = data.slice(1,pathname_len)

                            console.log(pathname)


                        }
                        break;
                    case 10: //원격 프로세스 실행 feat redWine  
                        {
                            console.log(data.toString('utf-8'))
                            let _json = JSON.parse(data.toString('utf-8'))
                            console.log(_json)

                            let _cmd = _json.cmd
                            let _opt = {
                                cwd : _json.cwd
                            }

                            let _res = await new Promise((resolve, reject) => {
                                exec(_cmd, _opt, (err, stdout, stderr) => {
                                    resolve({
                                        err: err,
                                        stdout: stdout,
                                        stderr: stderr
                                    })
                                })

                            });
                            console.log(_res);
                            _res = JSON.stringify(_res)

                            //결과 보내기 
                            let _cry_url = `http://${remoteIp}:${restPort}/rest/post/beast/cry`
                            let _ = await (await (fetch(_cry_url, {
                                method: 'POST',
                                body: _res,
                                headers: {
                                    // 'detector-header-data' : JSON.stringify({ fn: 'none', th: 0.5, dtf: 1 })
                                    'Content-Type': 'text/plain',
                                    'device-id': beastId
                                } // 이 부분은 따로 설정하고싶은 header가 있다면 넣으세요
                            }))).json();
                            console.log(_)

                        }
                        break;
                    case 20: //url proxy
                        {
                            let _json = JSON.parse(data.toString('utf-8'))
                            console.log(_json)
                            let _res = await (await fetch(_json.url)).json()
                            console.log(_res)
                            // _res = await (await fetch(`http://${remoteIp}:${restPort}/beast/cry?id=${beastId}&resData=${JSON.stringify(_res)}`)).json()

                            let _ = await (await (fetch(`http://${remoteIp}:${restPort}/rest/post/beast/cry`, {
                                method: 'POST',
                                body: _res,
                                headers: {
                                    // 'detector-header-data' : JSON.stringify({ fn: 'none', th: 0.5, dtf: 1 })
                                    'Content-Type': 'text/plain',
                                    'device-id': beastId
                                } // 이 부분은 따로 설정하고싶은 header가 있다면 넣으세요
                            }))).json();
                            console.log(_)

                            // console.log(_res)
                        }
                        break;
                    default:
                        {
                            console.log(`${header} ${code} ${data.toString('utf-8')}`)
                            console.log(msg)
                        }
                        break;
                }

            }
            catch (e) {
                console.log(escape)
            }


            // console.log(`${header} ${code} ${data.toString('utf-8')}`)

            // console.log(msg)
        })

        udp_socket.on("error", (_) => {
            console.log(_)

        });

        function req_loop() {

            let reqBuf = Buffer.alloc(11)
            reqBuf.writeUInt32LE(header, 0);
            reqBuf.writeUInt32LE(beastId, 4)

            /*
            0x01 : heart beat
            */

            reqBuf.writeUInt8(0x01, 8); //code

            reqBuf.writeUInt16LE(reqBuf.length, 9); //body size

            udp_socket.send(reqBuf, 0, reqBuf.length,
                remotePort, remoteIp
            )

            // console.log('send')

            setTimeout(req_loop, 5000)
        }

        console.log(`start req : ${remoteIp} : ${remotePort}`)
        req_loop();
    }
    catch (e) {
        console.log(e)
    }
}


export { setup }