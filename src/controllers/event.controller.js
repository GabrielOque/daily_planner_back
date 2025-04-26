import Events from "../models/Events.js";
import Users from "../models/Users.js";
import { v4 as uuidv4 } from "uuid";
import { generateTokenLiveKit } from "../utils/generateTokenLiveKit.js";
import {
  sendUpdateNotification,
  sendInvitationEmail,
} from "../utils/sendEventNotification.js";
import { transporter } from "../libs/nodemailer.js";
import { FRONTEND_URL } from "../config.js";

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

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, startDate, startTime, endTime, participants } =
    req.body;

  try {
    const event = await Events.findByIdAndUpdate(
      id,
      {
        name,
        description,
        startDate,
        startTime,
        endTime,
        participants,
        coordinator: req.user.email,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ code: "EVENT_NOT_FOUND" });
    }

    const user = await Users.findOne({
      email: req.user.email,
    });

    await sendUpdateNotification({
      to: [...participants, req.user.email],
      name,
      userName: user.name,
      userEmail: req.user.email,
      description,
      startDate,
      startTime,
      endTime,
      roomName: event.roomName,
    });

    res.status(200).json(event);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Events.findByIdAndUpdate(
      id,
      {
        isArchived: true,
      },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ code: "EVENT_NOT_FOUND" });
    }

    await transporter.sendMail({
      from: '"Daily Planner" <oquendodev@gmail.com>',
      to: [...event.participants, event.coordinator],
      subject: `Cancelación: ${event.name}`,
      html: `
      <p>Hola, ${event.coordinator} ha cancelado ${event.name}</p>
      <p>Descripción: ${event.description}</p>
      <p>
        <a href="${FRONTEND_URL}/planner/calendar"
          style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px;">
          Ver Calendario
        </a>
      </p>
    `,
    });
    res.status(200).json(event);
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
