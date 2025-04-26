import Events from "../models/Events.js";
import Users from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";
import { generateTokenLiveKit } from "../utils/generateTokenLiveKit.js";
import { sendInvitationEmail } from "../utils/sendEventNotification.js";

export const createEvent = async (req, res) => {
  const {
    name,
    description,
    coordinator,
    participants,
    startDate,
    startTime,
    endTime,
  } = req.body;

  try {
    const user = await Users.findOne({
      email: coordinator,
    });

    //Create token for create meeting
    const userId = user._id.toString();
    const roomName = uuidv4();
    await generateTokenLiveKit(userId, user.name, roomName);

    // Create event in DB
    await Events.create({
      name,
      description,
      coordinator,
      participants: participants,
      startDate,
      startTime,
      endTime,
      roomName,
    });

    await sendInvitationEmail({
      to: [...participants, coordinator],
      name,
      userName: user.name,
      userEmail: coordinator,
      description,
      startDate,
      startTime,
      endTime,
      roomName,
    });
    res.status(201).json({
      code: "EVENT_CREATED",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const getEvents = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await Users.findOne({
      email: email,
    });

    const events = await Events.find({
      $or: [{ coordinator: email }, { participants: { $in: [email] } }],
      isArchived: false,
    });

    res.status(200).json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const joinMeeting = async (req, res) => {
  const { roomName, userEmail, userName } = req.body;

  if (!roomName || !userEmail) {
    return res.status(400).json({ code: "ROOM_NAME_OR_USER_NAME_MISSING" });
  }

  const user = await Users.findOne({
    email: userEmail,
  });

  if (!user) {
    return res.status(400).json({ code: "USER_NOT_FOUND" });
  }

  const userId = user._id.toString();

  const token = await generateTokenLiveKit(userId, userName, roomName);

  res.json({ token: token });
};
