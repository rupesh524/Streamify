import mongoose from "mongoose";


const UserSchema =  new mongoose.Schema({
        fullname :{
               type : String,
               required : true,
        },
        email :{
             type : String,
             required : true,
             unique : true,
        },
        password :{
             type : String,
             required : true,
             minlength : 8,
        },
        bio :{
             type : String,
             default : ""
        },
        NativeLanguage:{
             type : String,
             default : "",
        },
        LearningLanguage :{
             type : String,
             default : "",
        },
        Location :{
             type : String,
             default : "",
        },
        ProfilePicture :{
             type : String,
             default : "",
        },
        isonboarded : {
               type : String,
               default : false,
        },
        friends :
             [
             {type : mongoose.Schema.Types.ObjectId,
                ref : "User"
             }
             ]
    },{timestamps : true});

 const User = new mongoose.model("User",UserSchema);
 export default User;