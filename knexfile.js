const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE
    },
    pool: {
      afterCreate: function(connection, callback) {
        connection.query("SET @@global.time_zone = '+3:00';", function(err) {
          callback(err, connection);
        });
      }
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'mysql',
    connection: {
      host: process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      database : process.env.DB_DATABASE,
    },
    pool: {
      afterCreate: function(connection, callback) {
        connection.query("SET @@global.time_zone = '-3:00';", function(err) {
          callback(err, connection);
        });
      }
    },
    migrations: {
      directory: './src/database/migrations'
    },
    useNullAsDefault: true,
  }

};
