import User from "../Models/User.model.js";
import bcrypt from "bcryptjs"
import validator from "validator"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async(req,res)=>{
  try {
      const {email,password,fullName} = req.body;
       
      if(!email || !password || !fullName ){
       return     res.status(400).json({message : "Please provide all details"});
      }
      if(password.length < 8){
          return res.status(400).json({message : "invalid password"});
      }
      if(!validator.isEmail(email)){
           return res.status(400).json({message : "please provide valid email "});
      }
      const existeduser = await User.findOne({email});
         
      if(existeduser) {
        return res.status(409).json({message : "User already exists"});
      }

      const idx = Math.floor(Math.random()*100)+1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;  
      const hashedpassword =  await bcrypt.hash(password,10);
      const CreatedUser = await User.create({
            fullName,
            email,
            password : hashedpassword,
            profilePic : randomAvatar,

      })

       // creating a stream user with this data 
       await upsertStreamUser({
           id :  CreatedUser._id.toString(),
           name : CreatedUser.fullName,
           email : CreatedUser.email,
           ProfilePicture : CreatedUser.profilePic || ""
       });
       console.log(`Stream User created for user ${CreatedUser.fullName}`);
       
    if(!CreatedUser) return res.status(503).json({message : "Error while creating the user"});
     
    const token = jwt.sign({userid : CreatedUser._id},process.env.JWT_SECRET
      ,{
        expiresIn : "7d"
      }
    )
     res.cookie("jwt",token,{
       maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true, // prevent XSS attacks,
  sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
     })
     res.status(201).json({success : true,user : CreatedUser});
  } catch (error) {
      console.log(error);
      res.status(500).json({message : "internal server error"});
  }      
}


export const login = async(req,res)=>{
         try {
             const {email,password} = req.body;
             console.log(email);
             

             if(!email || !password) {
               return res.status(400).json({message :  "please provide both email and password"});
             }

             if(!validator.isEmail(email)){
                return res.status(400).json({message : "please provide correct email address"});
             }

             const user = await User.findOne({email});
             if(!user){
              return res.status(404).json({message :"User is not registered"});
             }

             const checkpassword = await bcrypt.compare(password,user.password);
              console.log(checkpassword);
             if(!checkpassword){
              return res.status(401).json({message : "incorrect password"});
             }
             
             
             const token = jwt.sign({userid : user._id},
              process.env.JWT_SECRET,
              {
                expiresIn : "7d"
              }
             )
            
             
             res.cookie("jwt",token,{
              maxAge: 7 * 24 * 60 * 60 * 1000,
          httpOnly: true, // prevent XSS attacks,
        sameSite: "lax",
         secure: process.env.NODE_ENV === "production",
             })
             return res.status(200).json({success : true,user});
         } catch (error) {
              console.log(error);
              return res.status(500).json({message : "error while signing in "});
              
         }
}


export const logout = (req,res)=>{
         res.clearCookie("jwt",{
           secure : true,
              httpOnly : true,
               sameSite: "strict"
         });
         res.status(200).json({ success: true, message: "Logout successful" });
}


export const onboarding = async(req,res)=>{
       try {
           const userid = req.user._id;
           const {fullName, bio, nativeLanguage, learningLanguage, location} = req.body;

           if(!fullName || !bio || !nativeLanguage || !learningLanguage ||!location ){
               return res.status(400)
               .json({message : "please provide all fields",
                missingFields : [
                      !fullName && "fullName",
                      !bio && "bio",
                      !nativeLanguage && "nativeLanguage",
                      !learningLanguage && "learningLanguage",
                      !location && "location",
                ],
            });
           }
           
         const updateduser =   await User.findByIdAndUpdate(userid,{
                  ...req.body,
                  isonboarded : true,
           },{new : true})
         
          if(!updateduser) return res.status(404).json({message : "User not found"});

       try {
      await upsertStreamUser({
        id: updateduser._id.toString(),
        name: updateduser.fullName,
        image: updateduser.profilePic || "",
      });
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }
           return res.status(200).json({success : true , user : updateduser});
       } catch (error) {
              console.log(error);
              return res.status(500).json({message : "error while updating the user"});   
       }       
}


export const getdetails = (req,res)=>{
        res.status(200).json({ success: true, user: req.user });
}

