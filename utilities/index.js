const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ***************
    Construct the nav HTML undered list
    **************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row)=> {
        list += "<li>"
        list += 
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>"
    list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildInventorySingleGrid = async function (data) {
  let grid
  try {
    if (data && Object.keys(data).length> 0) {
      grid = `
              <div class="vehicle-grid">
                <div class="vehicle-image">
                  <a href="../../inv/detail/${data.inv_id}" 
                    title="View ${data.inv_make} ${data.inv_model} details">
                    <img src="${data.inv_thumbnail}" 
                        alt="Image of ${data.inv_make} ${data.inv_model} on CSE Motors" />
                  </a>
                </div>
                <section class="vehicle-details">
                  <h2>Vehicle Details</h2>
                  <p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(Number(data.inv_price))}</p>
                  <p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
                  <p><strong>Description:</strong> ${data.inv_description}</p>
                </section>
              </div>
            `
    } else {
      grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
  } catch (error) {
    grid = '<p class="notice">An error occurred while loading vehicle details. Please try again later.</p>'
  }
  
  return grid
}

/* ****************************************
 * classification list options must appear in a drop-down select list.
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassications()
  let classificationList = '<select name="classification_id" id="classification_id" required >'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (classification_id != null && row.classification_id == classification_id) {
        classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Middleware For Interntinal 500 Errors
 * 
 * Error in the Footer
 **************************************** */
Util.intentionalErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

module.exports = Util