
// Listen to incoming HTTP requests (can only be used on the server).
import moment from "moment";
import urlParser from "url";
import {Meteor} from "meteor/meteor";
import {exec as childExec} from "child_process";
import iwlist from "wireless-tools/iwlist";

const os = require('os')

WebApp.connectHandlers.use('/rest/sysinfo', (req, res, next) => {

  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);

  let _url = urlParser.parse(req.url,true);

  let result = {
    "meteorVersion" : Meteor.release,
    appVersion: global.appVersion,
    os : {
      platform : os.platform(),
      version : os.release()
    },

  }

  console.log(result)

  res.end( JSON.stringify( result) );




  // res.end(`{meteor version : ${Meteor.release}, appVersion: ${global.appVersion.major},${global.appVersion.miner},${global.appVersion.rev} }`);
});

WebApp.connectHandlers.use('/rest/test', (req, res, next) => {
  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);
  res.end(`it is test`);
});

WebApp.connectHandlers.use('/rest/exec', (req, res, next) => {

  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);

  let _url = urlParser.parse(req.url,true);

  childExec(_url.query.cmd,  (err, stdout, stderr) =>{

    let result = {
      err : err,
      stdout : stdout,
      stderr : stderr
    }

    // console.log(result)

    res.end( JSON.stringify( result) );

  })


});

//setDate?d=20190830&t=131003
WebApp.connectHandlers.use('/rest/setDate', (req, res, next) => {

  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);

  let _url = urlParser.parse(req.url,true);

  let result = {
    date : _url.query.d,
    time : _url.query.t
  }

  let _date = _url.query.d;

  let _time = _url.query.t;

  // _date = spliceSplit(_date,4,1,'-')
  console.log(_date)

  //let timeStr = ''

  let _tms = moment(_date+'T'+_time)

  let _cmd = `date -s '${_tms.format("YYYY-MM-DD HH:mm:ss")}'`;
  console.log(_cmd)

  //date -s '2019-01-25 12:34:56'
  if( os.platform() === 'linux') {

    childExec(_cmd,  (err, stdout, stderr) =>{

      let result = {
        err : err,
        stdout : stdout,
        stderr : stderr
      }

      // console.log(result)

      res.end( JSON.stringify( result) );

    })

  }


  res.end( JSON.stringify( result) );


});
/*
인자 설명
interface : 네트월 디바이스 이름
http://192.168.4.102:3080/scanAp?interface=wlan0
 */

WebApp.connectHandlers.use('/rest/scanAp', (req, res, next) => {
  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);

  let result = urlParser.parse(req.url,true);

  let interfaceName = result.query.interface

  iwlist.scan(interfaceName,(err,network)=> {

    let _rst = ''

    if(err) {
      console.log(JSON.stringify(err))
      _rst = JSON.stringify(err)
      res.end(_rst)
    }
    else {
      console.log(JSON.stringify(network))
      res.end(JSON.stringify(network))
    }

  })


});

WebApp.connectHandlers.use('/rest/onoff', (req, res, next) => {
  var header = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Max-Age': '1000',
    'Content-Type': 'Application/json'
  };

  res.writeHead(200,header);

  let _url = urlParser.parse(req.url,true);

  let _args = {
    pin : _url.query.pin,
    value : _url.query.value
  }

  console.log(_args)

  theApp.onoffNetApp.writeGpio({
    port : parseInt( _args.pin),
    value : parseInt( _args.value)
  })



  res.end(JSON.stringify({result:'ok'}));
});
