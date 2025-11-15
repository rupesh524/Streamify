import mongoose from "mongoose";

const connectdb = async ()=>{
       try {
           const connectioninstnace   = await mongoose.connect(process.env.MONGODBURL);
           console.log("CONNECTION SUCCESSFULL");
           
       } catch (error) {
           console.log("connection unsucessfull ",error);
           process.exit(1);
       }
}


export default connectdb;