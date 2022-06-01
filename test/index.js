const Snowflake = require('../dist').Snowflake
const id = new Snowflake(1n,1n).nextId().toString();
console.log(id);