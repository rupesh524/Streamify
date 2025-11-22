import express from "express"
import { getdetails, login, logout, onboarding, signup } from "../Controllers/Auth.Controller.js";
import { protectroute } from "../Middlewares/auth.middleware.js";

const Router = express.Router();

Router.post("/signup",signup);

Router.post("/login",login);
Router.post("/logout",logout);
Router.post("/onboarding",protectroute,onboarding);
Router.get("/me",protectroute,getdetails);
export default Router;