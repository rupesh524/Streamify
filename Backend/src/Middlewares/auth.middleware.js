import jwt from "jsonwebtoken"
import User from "../Models/User.model.js";
import dotenv from "dotenv";
dotenv.config();

export const protectroute = async(req,res,next)=>{
          try {
             const token = req.cookies.jwt // || req.headers.authorization.split(" ")[1];
             
             if(!token){
              return   res.status(401).json({message : "please login first"});
             }
             const decodedtoken = jwt.verify(token,process.env.JWT_SECRET);
             if(!decodedtoken){
               return res.status(400).json({message : "error or expired token"})
             }
             console.log(decodedtoken);
             
             const user = await User.findById(decodedtoken.userid).select("-password");
             if(!user){
                return res.status(404).json({message : "User not found"});
             }
             
             req.user = user;
             next();
          } catch (error) {
               console.log(error);
               return res.status(500).json({message : "error while generating the token "});  
          }
}