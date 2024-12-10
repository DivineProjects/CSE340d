const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res) {
    const nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login", 
        nav
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    console.log("inside account register")
    let nav = await utilities.getNav()
    // req.flash("registration Started")
    res.render("account/register", {
      title: "Register",
      nav,
    })
  }

module.exports = {buildLogin, buildRegister}