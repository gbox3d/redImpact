/*

create by gbox3d 2019.2.22

 */

//const host =
// import {exec  as childExec } from 'child_process';

const childExec = require('child_process').exec;
const dgram = require( "dgram" );
const udp_socket = dgram.createSocket( "udp4" );

const os = require('os')

let onoff;
if( os.cpus().length === 8 ) {

  //라즈베리가 아니라면 더미로 대치
  onoff = {
    Gpio :  function(portnum,mode) {
      {
        this.portnum = portnum;
        this.mode = mode;

      }
    }
  }

  onoff.Gpio.prototype.writeSync = function(val) {
    console.log(this.portnum + ' call dummy writeSync ' + val)
  }
}
else {
  onoff = require('onoff')
}

function onoffNet({bindCallback,host}) {

  // console.log(os.cpus())

  // this.appInfo = {
  //   version : 100,
  //   cpus : os.cpus()
  // }

  let remote_peer = {};

  let onOffPins = [];

  const Gpio = onoff.Gpio;

  // onOffPins[17] = new Gpio(17, 'out');
  // onOffPins[18] = new Gpio(18, 'out');
  // onOffPins[23] = new Gpio(23, 'out');
  // onOffPins[24] = new Gpio(24, 'out');
  // onOffPins[25] = new Gpio(25, 'out');
  // onOffPins[8] = new Gpio(8, 'out');
  // onOffPins[7] = new Gpio(7, 'out');

  // onOffPins[5] = new Gpio(1, 'out');
  // onOffPins[6] = new Gpio(1, 'out');
  onOffPins[12] = new Gpio(12, 'out');
  onOffPins[13] = new Gpio(13, 'out');
  onOffPins[16] = new Gpio(16, 'out');
  onOffPins[19] = new Gpio(19, 'out');
  onOffPins[20] = new Gpio(20, 'out');
  onOffPins[21] = new Gpio(21, 'out');

  this.onOffPins = onOffPins;

  //초기화
  onOffPins.forEach((_,i)=> {
    if(_) {
      if(_.mode === 'out') {
        _.writeSync(0);
      }
    }
  })

  this.sendTo =  ({ip, port, data}) => {
    udp_socket.send( Buffer.from(data), 0, data.length,port,ip);
  }

  this.writeGpio = ({port,value}) => {

    // console.log('write gpio',port,value)

    onOffPins[port].writeSync(value)
  }

  udp_socket.on( "message", ( packet, rinfo )=> {

    remote_peer = rinfo

    console.log( remote_peer.address + ':' + rinfo.port + ' - ' + packet );

    try {

      let _pkt = JSON.parse(packet)

      console.log(_pkt)

      switch(_pkt.c)
      {
        case 'dw':
        {
          // console.log('digital write ' + _pkt.p + ',' + _pkt.v)

          onOffPins[_pkt.p].writeSync(_pkt.v)
          this.sendTo({
            ip : remote_peer.address,
            port : remote_peer.port,
            data : JSON.stringify({r:'ok'})
          });
        }
          break;
        case 'info':
        {
          //console.log('info ' + )
          this.sendTo({
            ip : remote_peer.address,
            port : remote_peer.port,
            data : JSON.stringify(this.appInfo)
          });
        }
          break;
        case 'bash':
        {
          childExec(_pkt.cmd,  (err, stdout, stderr) =>{

            let result = {
              err : err,
              stdout : stdout,
              stderr : stderr
            }

            this.sendTo({
              ip : remote_peer.address,
              port : remote_peer.port,
              data : JSON.stringify(result)
            });
            // console.log(result)
            // res.end( JSON.stringify( result) );

          })

        }
          break;
      }

    }
    catch(e) {

      console.log('parse error')
      console.log(e)

    }



  });

  udp_socket.bind( {
      address : host.ip,
      port : host.port
    } ,
    ()=> {
      let socket_info = udp_socket.address()
      console.log("onoffnet start on : " + socket_info.address  + ":" + socket_info.port)

      if(bindCallback) bindCallback();
    }
  )

  this.getInfo = function () {
    return "onoffnet veriosn 101"
  }

  this.udp_socket = udp_socket;
}

module.exports = onoffNet;

//export {onoffNet}


