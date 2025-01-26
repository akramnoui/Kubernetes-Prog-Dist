/* eslint-disable object-curly-newline */
const httpStatus = require('http-status');
const passport = require('passport');
const { authService, userService, tokenService } = require('../services');
const emailService = require('../services/email.service')

const registerUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const registerEstablishmentOwner = async (req, res) => {
  try {
    const user = await userService.createUser({ ...req.body, role: 'owner' });
    const tokens = await tokenService.generateAuthTokens(user);
    res.status(httpStatus.CREATED).send({ user, tokens });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    passport.authenticate("local", async function (err, user, info) {
      if (err) {
        res.json({ success: false, message: err });
      }
      else {
        if (!user) {
          console.log(user);
          res.json({ success: false, message: "email or password incorrect" });
        }
        else {
          const tokens = await tokenService.generateAuthTokens(user);
          res.send({ user, tokens });
        }
      }
    })(req, res);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const refreshTokens = async (req, res) => {
  try {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
  } catch (error) {
    res.status(httpStatus.UNAUTHORIZED).send({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
    await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(200).json({resetPasswordToken: resetPasswordToken});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.query.token, req.body.password);
    res.status(200).json({message: "Your password has been updated successfully"});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const sendVerificationEmail = async (req, res) => {
  try {
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
    await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.OK).json({verifyEmailToken: verifyEmailToken});
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    await authService.verifyEmail(req.query.token);
    res.status(httpStatus.OK).send({ message: "Email successfully verified" });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error.message });
  }
};

module.exports = {
  registerUser,
  registerEstablishmentOwner,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
