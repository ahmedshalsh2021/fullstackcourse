const mongoDbStore = require("connect-mongodb-session");
const expressSession = require('express-session');

function createSessionStore() {
  const MongoDBStore = mongoDbStore(expressSession);

  const store = new MongoDBStore({
    uri: "mongodb://localhost:27017",
    databaseName: "myshop",
    collection: "sessions",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  };
}

module.exports = createSessionConfig;