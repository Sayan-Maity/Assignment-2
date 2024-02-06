const express = require("express")
const { disease } = require("../controllers/Disease")
const router = express.Router()


router.post("/getDiseaseInformation", disease)

module.exports = router