const { Snowflake } = require('../dist')

const id = new Snowflake(1n, 1n).nextId().toString();
console.log(id);