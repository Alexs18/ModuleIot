const pg = require('pg');
const {configDatabase} = require('../config');

const Pool = new pg.Pool(configDatabase);
module.exports = Pool;