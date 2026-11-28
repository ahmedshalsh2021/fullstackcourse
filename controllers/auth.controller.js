const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      name: "",
      street: "",
      postal: "",
      city: "",
    };
  }

  res.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const body = req.body;

  // password is deliberately not stored in the session
  const enteredData = {
    email: body.email,
    confirmEmail: body.confirmEmail,
    password: "",
    name: body.name,
    street: body.street,
    postal: body.postal,
    city: body.city,
  };

  if (
    !validation.userDetailsAreValid(
      body.email,
      body.password,
      body.name,
      body.street,
      body.postal,
      body.city
    ) ||
    !validation.emailConfirmed(body.email, body.confirmEmail)
  ) {
    sessionFlash.flashDataToSession(
      req,
      { errorMessage: "Please check your input data.", ...enteredData },
      function () {
        res.redirect("/signup");
      }
    );
    return; // stops signup() itself
  }

  const user = new User(
    body.email,
    body.password,
    body.name,
    body.street,
    body.postal,
    body.city
  );

  try {
    const alreadyExists = await user.existsAlready();

    if (alreadyExists) {
      sessionFlash.flashDataToSession(
        req,
        { errorMessage: "This email already exists.", ...enteredData },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect("/login");
}

function getLogin(req, res) {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("customer/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const body = req.body;
  const user = new User(body.email, body.password);

  // password is deliberately not stored in the session
  const sessionErrorData = {
    errorMessage: "Invalid credentials. Please check your email or password.",
    email: user.email,
    password: "",
  };

  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    return next(error);
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
    return;
  }

  let passwordIsCorrect;
  try {
    passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);
  } catch (error) {
    return next(error);
  }

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect("/login");
    });
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