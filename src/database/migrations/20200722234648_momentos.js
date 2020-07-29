
exports.up = function(knex) {
  return knex.schema.createTable('momentos', (table) => {
    table.increments('id').unique().primary().unsigned();
    
    table.string('titulo').notNullable();
    table.string('descricao').notNullable();
    table.integer('curtidas').unsigned().defaultTo(0);
    table.string('caminho_imagem').nullable();

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
