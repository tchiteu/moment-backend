exports.up = function(knex, Promise) {
	return knex.schema.createTable('usuarios', function(table) {
		table.increments('id').notNull().primary();
		
		table.string('nome', 50).notNull();
		table.string('usuario', 16).notNull().unique();
		table.string('email', 60).notNull().unique();
		table.string('senha', 140).notNull();
		table.string('pais', 50).notNull();
		table.string('codigo', 4).notNull();
		table.boolean('verificado').notNull().defaultTo(false);

		table.dateTime('created_at').defaultTo(knex.fn.now());
		table.dateTime('updated_at').nullable();
		table.dateTime('deleted_at').nullable();
	});
};

exports.down = function(knex, Promise) {
	return knex.schema.dropTable('usuarios');
};