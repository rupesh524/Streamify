import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectdb from "./DB/index.js";
import authroute from "./Routes/Auth.route.js"
import userroute from "./Routes/Auth.route.js"
const app = express();

app.use(express.json());
dotenv.config();

const PORT = process.env.PORT||5000;
app.use(cookieParser());
app.use("/api/auth",authroute);
app.use("/api/users",userroute);

app.use(express.json());

connectdb()
.then( ()=>{
      app.listen(PORT,()=>{
           console.log(`Server is running at ${PORT}`);
      })   
    })
    .catch(
        (err)=>{
             console.log("database connection failed");
              })

//app.listen(4000);