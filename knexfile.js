module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/moment.sqlite'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: '',
      database: '',
      user:     '',
      password: '',
      filename: './src/database/db_moment.mysql'
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  }

};
