// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build Account Login View
router.get("/login", accController.buildLogin)
router.get("/register", accController.buildRegister)
router.post("/register",
    regValidate.registationRules(), 
    regValidate.checkRegData, 
    utilities.handleErrors(accController.registerAccount)
)


// Process the login attempt
router.post(
    "/login", 
    regValidate.loginRules(),
    regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )
module.exports = router;