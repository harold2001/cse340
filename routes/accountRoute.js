const regValidate = require('../utilities/account-validation');
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

router.get(
  '/',
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

// Route to build inventory by classification view
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get(
  '/register',
  utilities.handleErrors(accountController.buildRegister)
);
// Process the registration data
router.post(
  '/register',
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// Process the login attempt
router.post(
  '/login',
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;
