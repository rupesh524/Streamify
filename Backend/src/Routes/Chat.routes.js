import express from "express"
import { protectroute } from "../Middlewares/auth.middleware.js";
import { getstreamtoken } from "../Controllers/Chat.controller.js";


const router = express.Router();

router.post("/token",protectroute,getstreamtoken);


export default router;