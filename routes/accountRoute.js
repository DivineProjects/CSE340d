// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build Account Login View
router.get("/", accountController.buildLoginSucess)
router.get("/login", accountController.buildLogin)
router.get("/register", accountController.buildRegister)
router.post("/register",
    regValidate.registationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount)
)


// Process the login attempt
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
  )
module.exports = router;