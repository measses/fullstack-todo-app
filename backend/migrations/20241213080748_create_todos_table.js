exports.up = function (knex) {
  return knex.schema.createTable("todos", function (table) {
    table.increments("id").primary(); // Otomatik artan id
    table.string("text", 255).notNullable(); // Text alanı
    table.boolean("completed").defaultTo(false); // Tamamlandı mı
    table.timestamp("created_at").defaultTo(knex.fn.now()); // Oluşturulma tarihi
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("todos");
};
