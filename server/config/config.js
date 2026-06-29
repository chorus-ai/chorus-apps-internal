require('dotenv').config();

const sqlite = {
  app: {
    dialect: "sqlite",
    storage: "data/db.sqlite3",
  },
  omop: {
    dialect: "sqlite",
    storage: "data/omop.sqlite3",
  },
  vocab: {
    dialect: "sqlite",
    storage: "data/db.sqlite3",
  },
};

const test = {
  dialect: "sqlite",
  storage: ":memory:",
};

const postgres = {
  app: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      schema: "app",  
    }
  },
  omop: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      schema: "omopcdm",  
    }
  },
  vocab: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
    },
    define: {
      schema: "app",  
    }
  },
};


module.exports = {
  sqlite,
  test,
  postgres,
};