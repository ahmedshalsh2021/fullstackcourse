const User = require("../models/user.model");
function getSignup(req, res) {
  res.render("customer/auth/signup");
}
async function signup(req, res) {
  const body = req.body;

  if (body.email !== body.confirmEmail) {
    return res.redirect("/signup");
  }

  const user = new User(
    body.email,
    body.confirmEmail,
    body.password,
    body.name,
    body.street,
    body.postal,
    body.city,
  );

  await user.signup();

  res.redirect("/login");
}
function getLogin(req, res) {
  res.render("customer/auth/login");
}

module.exports = { getSignup: getSignup, getLogin: getLogin, signup: signup };
