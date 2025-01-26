const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles.config');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

  req.user = user;  

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    
    // eslint-disable-next-line max-len
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight))
    if (!hasRequiredRights && user.role !== 'admin') {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth = (...requiredRights) => async (req, res, next) => new Promise((resolve, reject) => {
  passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
})
  .then(() => next())
  .catch((err) => next(err));

module.exports = auth;
