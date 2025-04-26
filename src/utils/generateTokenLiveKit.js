import { AccessToken } from "livekit-server-sdk";
import { LIVEKIT_SECRET_KEY, LIVEKIT_API_KEY } from "../config.js";

export const generateTokenLiveKit = async (userId, userName, roomName) => {
  const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_SECRET_KEY, {
    identity: userId,
    name: userName,
  });

  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const jwt = await token.toJwt();
  return jwt;
};
