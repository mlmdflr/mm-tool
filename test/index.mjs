import { Snowflake } from "../dist/index.mjs";

const id = new Snowflake(1n, 1n).nextId().toString();
console.log(id);