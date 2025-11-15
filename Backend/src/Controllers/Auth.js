import User from "../Models/User.model.js";
import bcrypt from "bcryptjs"
import validator from "validator"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async(req,res)=>{
  try {
      const {email,password,fullname} = req.body;
       
      if(!email || !password || !fullname ){
       return     res.status(400).json({message : "Please provide all details"});
      }
      if(password.length < 6){
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
            fullname,
            email,
            password : hashedpassword,
            ProfilePicture : randomAvatar,

      })

       // creating a stream user with this data 
       await upsertStreamUser({
           id :  CreatedUser._id.toString(),
           name : CreatedUser.fullname,
           email : CreatedUser.email,
           ProfilePicture : CreatedUser.ProfilePic || ""
       });
       console.log(`Stream User created for user ${CreatedUser.fullname}`);
       
    if(!CreatedUser) return res.status(503).json({message : "Error while creating the user"});
     
    const token = jwt.sign({userid : CreatedUser._id},process.env.JWT_SECRET
      ,{
        expiresIn : "7d"
      }
    )
     res.cookie("jwt",token,{
      httpOnly : true,
      secure : true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict"
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
             console.log(token);
             
             res.cookie("jwt",token,{
              secure : true,
              httpOnly : true,
              maxAge : 7*24*60*60*1000,
              sameSite: "strict"
             })
             return res.status(200).json({success : true,userr : user});
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
         return res.status(200).json({message : "logout successfully"});
}


export const onboarding = async(req,res)=>{
       try {
           const userid = req.user._id;
           const {fullname,bio,NativeLanguage,LearningLanguage,Location} = req.body;

           if(!fullname || !bio || !NativeLanguage || !LearningLanguage ||!Location ){
               return res.status(400)
               .json({message : "please provide all fields",
                missingFields : [
                      !fullname && "fullname",
                      !bio && "bio",
                      !NativeLanguage && "NativeLanguage",
                      !LearningLanguage && "LearningLanguage",
                      !Location && "Location",
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
      console.log(`Stream user updated after onboarding for ${updateduser.fullname}`);
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
         return res.status(200).json({
           message : "details fetched successfully" ,user : req.user 
         })
}

