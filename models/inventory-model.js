const pool = require("../database/")

/* 
Get all classification DataTransfer
 */
async function getClassications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")   
}

module.exports = { getClassications }