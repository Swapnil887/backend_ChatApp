const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.model");
const { BlackListModel } = require("../models/blacklist.model");


const authenticate = async(req,res,next)=>{
    const token = req.headers.authorization;
    try {
        var blacklist = await BlackListModel.findOne({blacklist:token})
        console.log(blacklist)
        if(!token || blacklist!=undefined){
            return res.json("You have to login first")
        }
        else{
            jwt.verify(token,"key",async (err,result)=>{
                if(err){
                    return res.json("token is not resolve please login again")
                }else{
                    var data = await UserModel.findOne({email:result})
                    req.body.name = data.name;
                    req.body.email = result
                    next()
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.json("Something went wrong in middleware")
    }
}


module.exports = {authenticate}