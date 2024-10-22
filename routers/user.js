const express = require("express");
const {getSingleUser,getAllUsers} = require("../controllers/user.js");
const {checkUserExist} = require("./../middleware/database/databaseErrorHelpers.js"); 
const {userQueryMiddleware}=require("../middleware/query/userQueryMiddleware.js");
const User = require("../models/User.js");

const router = express.Router();

router.get("/:id",checkUserExist,getSingleUser);
router.get("/getallusers",userQueryMiddleware(User),getAllUsers);

module.exports =router;