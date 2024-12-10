// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")
const utilities = require("../utilities")

// Route to build Account Login View
router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister)
router.post("/register", utilities.handleErrors(accController.registerAccount))

module.exports = router;