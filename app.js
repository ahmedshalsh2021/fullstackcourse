const path = require("path");
const express = require("express");
const expressSession = require("express-session");
const csrf = require("csurf");
const app = express();
const db = require("./data/database");
const createSessionConfig = require("./config/session");
const addCsrfTokenMiddleware = require("./middleware/csrf-token");
const errorHandlerMiddleware = require("./middleware/error-handler");
const checkAuthStatusMiddleware =require("./middleware/check-auth");
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/products.routes");
const baseRoutes = require("./routes/base.routes");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(expressSession(createSessionConfig()));

app.use(csrf());
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(productRoutes);
app.use(authRoutes);


app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log("Failed to connect to database");
    console.log(error);
  });
