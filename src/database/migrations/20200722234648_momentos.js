
exports.up = function(knex) {
  return knex.schema.createTable('momentos', (table) => {
    table.increments('id').unique().primary().unsigned();
    
    table.string('titulo', 25).notNullable();
    table.string('usuario', 16).notNullable();
    table.string('descricao', 101).notNullable();
    table.integer('curtidas', 7).unsigned().defaultTo(0);
    table.string('caminho_imagem', 100).nullable();

		table.dateTime('created_at').defaultTo(knex.fn.now());
		table.dateTime('updated_at').nullable();
    table.dateTime('deleted_at').nullable();
    
    table.integer('usuario_id').unsigned().notNullable();
    table.foreign('usuario_id').references('id').inTable('usuarios');
  })
};

exports.down = function(knex) {
	return knex.schema.dropTable('momentos');
};
