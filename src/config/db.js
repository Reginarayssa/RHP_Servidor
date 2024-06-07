const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let config = {
  user: 'DBAMV',
  password: 'root',
  connectString: 'rhphost.ddns.net:1521/XEPDB1'
  
};

module.exports = config;