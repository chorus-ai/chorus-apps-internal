require("dotenv").config();

const development = {
  sqlite_app: {
    dialect: "sqlite",
    storage: "data/db.sqlite3",
  },
  sqlite_omop: {
    dialect: "sqlite",
    storage: "data/omop.sqlite3",
  },
<<<<<<< HEAD
=======
  sqlite_vocab: {
    dialect: "sqlite",
    storage: "data/vocab.sqlite3",
  },
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
};

const test = {
  dialect: "sqlite",
  storage: ":memory:",
};

const production = {
  db_app: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
<<<<<<< HEAD
    database: process.env.DB_DB_NAME,
=======
    database: process.env.DB_NAME,
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
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
  db_omop: {
    dialect: "postgres",
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
<<<<<<< HEAD
    database: process.env.DB_DB_NAME,
=======
    database: process.env.DB_NAME,
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
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
<<<<<<< HEAD
=======
  db_vocab: {
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
      schema: "vocabulary",  
    }
  },
>>>>>>> e2f8beaaac133f380c75b3d6edefd575dc1a417c
};

module.exports = {
  development,
  test,
  production,
};