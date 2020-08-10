
exports.up = function(knex) {
  return knex.schema.createTable('blacklist', (table) => {
    table.increments('id').unique().primary().unsigned();
    
    table.string('token', 140).unique().notNull();

    table.dateTime('created_at').defaultTo(knex.fn.now());

    table.integer('usuario_id').unsigned().notNullable();
    table.foreign('usuario_id').references('id').inTable('usuarios');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('blacklist');
};
