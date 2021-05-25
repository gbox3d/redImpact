import YAML from 'yaml';
import fs from 'fs';
// const fetch = require('node-fetch');

// const beastClient = require('./beast')
import * as beastClient from './beast.js'


const settings_file = fs.readFileSync('./settings.yaml', 'utf8')

let _settings = YAML.parse(settings_file)

// console.log(_settings)

beastClient.setup({
    beastId: _settings.beastId,
    remoteIp: _settings.remoteIp,
    remotePort: _settings.remotePort,
    restPort: _settings.restPort,
    req_delay : _settings.req_delay
})



