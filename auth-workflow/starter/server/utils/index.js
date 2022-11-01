const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const {sendEmail, sendVerificationEmail, sendResetPassword} = require('./sendEmail');
const hashString = require('./createHash')
module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  sendEmail,
  sendVerificationEmail,
  sendResetPassword,
  hashString
};
