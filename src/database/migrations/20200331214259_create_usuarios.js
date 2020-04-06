exports.up = function(knex, Promise) {
	return knex.schema.createTable('usuarios', function(table) {
		table.string('id').notNull().primary();
		
		table.boolean('verificado').notNull().defaultTo(true);
		table.string('nome').notNull();
		table.string('sobrenome').notNull();
    table.string('email').notNull();
    table.string('cidade').notNull();
		table.string('uf', 2).notNull();
		table.string('senha').notNull();
		table.string('codigo', 8).notNull();

		table.dateTime('created_at').defaultTo(knex.fn.now());
		table.dateTime('updated_at').nullable();
		table.dateTime('deleted_at').nullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('usuarios');
};