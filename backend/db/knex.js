const knex = require("knex");

const db = knex({
  client: "pg", // PostgreSQL kullanıyoruz
  connection: {
    host: process.env.PG_HOST || "127.0.0.1",
    user: process.env.PG_USER || "mertaraz",
    password: process.env.PG_PASSWORD || "13122024",
    database: process.env.PG_DATABASE || "todos",
  },
});

module.exports = db;
