const User = require("../models/user.model");
function getSignup(req, res) {
  res.render("customer/auth/signup");
}
function signup(req, res) {
  const body = req.body;
  const user = new User(
    body.email,
    body.password,
    body.name,
    body.street,
    body.postal,
    body.city,
  );
  User.signup();
}
function getLogin(req, res) {
  //...
}

module.exports = { getSignup: getSignup, getLogin: getLogin, signup: signup };
