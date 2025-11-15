import {StreamChat} from "stream-chat"
import dotenv from "dotenv";
dotenv.config();



const apikey = process.env.STREAM_API_KEY;
const apisecret = process.env.STREAM_API_SECRET;

if(!apikey || !apisecret){
     console.error("both api key and secret are required")
}

const streamClient = StreamChat.getInstance(apikey, apisecret);

// uploading data of user on stream if it does not exist if exist update profile 
export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};
