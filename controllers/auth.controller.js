const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");
function getSignup(req, res) {
  res.render("customer/auth/signup");
}
async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body.confirmEmail,
    password: req.body.password,
    name: req.body.name,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };
  const body = req.body;

  const user = new User(
    body.email,
    body.password,
    body.name,
    body.street,
    body.postal,
    body.city,
  );

  if (
    !validation.userDetailsAreValid(
      body.email,
      body.password,
      body.name,
      body.street,
      body.postal,
      body.city,
    ) ||
    !validation.emailConfirmed(body.email, body.confirmEmail)
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Please Check Your Input Data",
        ...enteredData,
      },
      function () {
        res.redirect("signup");
        return;
      },
    );
  }
  try {
    const exist = await user.existsAlready();
    if (exist) {
      sessionFlash.flashDataToSession(
        req,
        {
          errorMessage: "This email already exists",
          ...enteredData,
        },
        function () {
          res.redirect("signup");
        },
      );
      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}
function getLogin(req, res) {
  res.render("customer/auth/login");
}
async function login(req, res) {
  const body = req.body;
  const user = new User(body.email, body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }
  // find exist user from model method
  const sessionErrorData = {
        errorMessage: "Invalid credentials.Please check your email or password",
        email: user.email,
        password: user.password,
      };
  if (!existingUser) {
    sessionFlash.flashDataToSession(
      req,
      sessionErrorData,
      function () {
        res.redirect("/login");
      },
    );
    return;
  }
  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password,
  );
  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(
      req,
      sessionErrorData,
      function () {
        res.redirect("/login");
      },
    );
    return;
  }
  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}
function logout(req, res) {
  authUtil.destroyUserSession(req);
  req.session.save(function () {
    res.redirect("/login");
  });
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
