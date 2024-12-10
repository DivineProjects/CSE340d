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

module.exports = {buildLogin}