import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectdb from "./DB/index.js";
import authroute from "./Routes/Auth.route.js"
import userroute from "./Routes/User.route.js"
import chatroute from "./Routes/Chat.routes.js"
import cors from "cors"
import path from "path";
const app = express();

dotenv.config();

const PORT = process.env.PORT||5000;
const __dirname = path.resolve();
app.use(cors({
      origin : "http://localhost:5173",
      credentials : true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authroute);
app.use("/api/users",userroute);
app.use("/api/chat",chatroute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}


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