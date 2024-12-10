// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController")

// Route to build Account Login View
router.get("/login", accController.buildLogin);
router.get("/register", accController.buildRegister)

module.exports = router;