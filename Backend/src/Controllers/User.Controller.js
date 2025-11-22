import  FriendRequest  from "../Models/FriendRequest.model.js";
import User from "../Models/User.model.js";




export const getrecommandedusers = async(req,res)=>{
       
    try {
          const currentuserid = req.user.id;
          const currentuser = req.user;
          const recommendedUsers = await  User.find({
             $and: [
        { _id: { $ne: currentuserid } },              // exclude current user
        { _id: { $nin: currentuser.friends } },       // exclude friends
        { isonboarded: true }                         // only onboarded users
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getmyfriends = async(req,res)=>{
      try {
      
        
        
    const userId = req.user._id;

    const user = await User.findById(userId)
      .select("friends")
      .populate(     //user ke andar toh pura user hai uske andar friends array hai usko populate kiya hai 
        "friends",   // usse jo bhi populate me likha hai wo sub bhi us friends array me aa gaya hai 
        "fullName nativeLanguage learningLanguage profilePic"
      );

    return res.status(200).json( user.friends );
  } catch (error) {
    console.error("Error in getmyfriends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const sendfriendrequest = async(req,res)=>{
            try {
                const myid = req.user.id;
                const {id : recipentId} = req.params;
                if(myid == recipentId)return res.status(400).json({message : "cannot send request to yourself"});
                
                const recipient = await User.findById(recipentId);
                if(!recipient){
                   return res.status(404).json({message : "invalid recipent id"})
                }
                if(recipient.friends.includes(myid)){
                    return res.status(400).json({message : "already a friend"});
                }

                // check if the request is already exists
                const existedrequest = await FriendRequest.findOne({
                    $or :[
                      {sender : myid , recipient : recipentId},
                      {sender : recipentId, recipient : myid},   
                    ]
                })
                if(existedrequest){
                  return res.status(400).json({message : "request already exists between you and this user"})
                }

                const newrequest = await  FriendRequest.create({
                       sender : myid,
                        recipient : recipentId,
                }
                )
                return res.status(200).json(newrequest);


            } catch (error) {
               res.status(500).json({message : "internal server error"});
            }
}

export const acceptFriendRequest = async(req,res)=>{
          try {
              const {id : requestId} = req.params;
              const request = await FriendRequest.findById(requestId);
              if(!request){
                 return res.status(400).json({message : "friend request not found"});
              }
               // Verify the current user is the recipient receprnt means user hi jisko req aari hai 
               if (request.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to accept this request" });
    }
          request.status = "accepted";
          await request.save();
          
          // add both id's to one each friends array 
          // addtoset add elements to array if do not exists 
          await User.findByIdAndUpdate(request.sender,{
            $addToSet : {friends : request.recipient}
          })

          await User.findByIdAndUpdate(request.recipient,{
            $addToSet : {friends : request.sender}
          })
            
          res.status(200).json({message : "friend request accepted"});
          } catch (error) {
            res.status(500).json({message : "internal server error"});
          }
}


 export const getFriendRequests = async(req,res)=>{
           try {
               const incomingReqs = await FriendRequest.find({
                  recipient : req.user.id,
                  status : "pending"
               }).populate("sender","fullName profilePic nativeLanguage learningLanguage")
                  
               // jisne meri requests accept kar li ho 
               const acceptedReqs = await  FriendRequest.find({
                     sender : req.user.id,
                     status : "accepted"
               }).populate("recipient","fullName profilePic");
               
               res.status(200).json({incomingReqs,acceptedReqs})
           } catch (error) {
                    res.status(500).json({message : "Internal Server error"})    
           }
} 

export const getoutgoingrequests = async (req,res)=>{
           try {
              const outgoingRequests  = await FriendRequest.find({
                sender : req.user.id,
                status : "pending"
              }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");
              res.status(200).json({outgoingRequests})
           } catch (error) {
            res.status(500).json({message : "Internal server error"});
           }
}