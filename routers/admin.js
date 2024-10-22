const express = require("express");
const {verifyToken,getAdminAccess} = require("../middleware/Authorization/auth");
const {blockUser,deleteUser} = require("../controllers/admin");
const {checkUserExist} = require("../middleware/database/databaseErrorHelpers");

const router = express.Router();
router.use([verifyToken,getAdminAccess]);

router.get("/",(req,res,next)=>{
    res.status(200).json({
        success: true,
        message:"admin page"
    });
})
router.get("/block/:id",checkUserExist,blockUser);
router.delete("/delete/:id",checkUserExist,deleteUser);
module.exports = router;