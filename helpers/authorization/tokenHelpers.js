const sendJwtToClient = (user,res) =>{
    const {JWT_COOKIE} = process.env;
    const token = user.generateJwtFromUser();
    res.status(200).cookie("authorization",token,{
        expires : new Date(Date.now() + Number(JWT_COOKIE)*1000*60),
        secure : true
    }).json({
        success: true,
        token : token,
        data : user
    });
}
module.exports = sendJwtToClient;