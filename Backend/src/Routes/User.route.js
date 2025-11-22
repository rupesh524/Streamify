import express from "express"
import { protectroute } from "../Middlewares/auth.middleware.js";
import { acceptFriendRequest, getFriendRequests, getmyfriends, getoutgoingrequests, getrecommandedusers,sendfriendrequest } from "../Controllers/User.Controller.js";

const router = express.Router();

router.use(protectroute);  // all routers which are here will use protect route
     
router.get("/",getrecommandedusers);

router.get("/friends",getmyfriends);

router.post("/friend-request/:id",sendfriendrequest);

router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friend-requests',getFriendRequests);
router.get('/outgoing-friend-requests',getoutgoingrequests);


export default router;

