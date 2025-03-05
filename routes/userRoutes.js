const router = require("express").Router();

const userAuth = require("../middleware/userAuth");
const validation = require("../middleware/validation");

const {login,logout,signup} = require("../controllers/auth.controller");
const userDetails = require("../controllers/userDetailsController");

router.post("/signup",validation,signup);
router.post("/login",validation,login);
router.get("/logout", logout);
router.get("/getUserDetails", userAuth, userDetails);

module.exports = router;
