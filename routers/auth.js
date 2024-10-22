const express = require("express");
const {deneme,Register,Login,logout,imageUpload,forgotPassword,resetPassword,editDetails}=require("../controllers/auth");
const {verifyToken} = require("../middleware/Authorization/auth");
const profileImageUpload = require("../middleware/libraries/profileImageUpload");


const router = express.Router();

router.get("/deneme",deneme);
router.post("/Register",Register);
router.get("/Login",Login);
router.get("/logout",verifyToken,logout);
router.post("/upload",[verifyToken,profileImageUpload.single("profile_image")],imageUpload)
router.post("/forgotpassword",forgotPassword);
router.put("/resetpassword",resetPassword);
router.put("/edit",verifyToken,editDetails);
module.exports = router;