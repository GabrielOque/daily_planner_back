import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import { SECRET_KEY, FRONTEND_URL, STAGE } from "../config.js";
import { uploadFile, deleteFile } from "../libs/cloudinary.js";
import { generateTokenLiveKit } from "../utils/generateTokenLiveKit.js";

export const createUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    const existingUser = await Users.findOne({
      email: email,
    });
    if (existingUser) {
      return res.status(400).json({
        code: "USER_ALREADY_EXISTS",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        code: "PASSWORDS_DO_NOT_MATCH",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await Users.create({
      name,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign(
      {
        email: result.email,
        id: result._id,
        name: result.name,
        image: result.image,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(201).json({
      name: result.name,
      email: result.email,
      id: result._id,
      image: result.image,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        code: "USER_NOT_FOUND",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        code: "INVALID_PASSWORD",
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.name,
        image: user.image,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      name: user.name,
      email: user.email,
      id: user._id,
      image: user.image,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const changePassword = async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await Users.findOne({
      email: email,
    });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await Users.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });

    res.status(200).json({
      name: result.name,
      email: result.email,
      id: result._id,
      image: result.image,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const checkToken = async (req, res) => {
  const token = jwt.sign(
    {
      name: req.user.name,
      email: req.user.email,
      id: req.user.id,
      image: req.user.image,
    },
    SECRET_KEY,
    {
      expiresIn: "1d",
    }
  );
  req.token = token;
  res.status(200).json({
    name: req.user.name,
    email: req.user.email,
    id: req.user.id,
    image: req.user.image,
    token: token,
  });
};

export const updateUser = async (req, res) => {
  let dataToUpdate = {};
  const { name, password } = req.body;
  const file = req.files?.image;
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        code: "USER_NOT_FOUND",
      });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12);
      dataToUpdate.password = hashedPassword;
    }
    if (name) {
      dataToUpdate.name = name;
    }
    if (file?.data) {
      const folder = `DailyPlanner/${STAGE}/Avatars/${req.user.name}_${req.user.id}`;
      const { public_id, secure_url } = await uploadFile(file.data, folder);
      if (!public_id || !secure_url) {
        return res.status(400).json({
          code: "FILE_NOT_UPLOADED",
        });
      }
      dataToUpdate.image = { public_id, secure_url };
    }

    const updatedUser = await Users.findByIdAndUpdate(
      req.user.id,
      dataToUpdate,
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(400).json({
        code: "USER_NOT_FOUND",
      });
    }
    const token = jwt.sign(
      {
        name: updatedUser.name,
        email: updatedUser.email,
        id: updatedUser._id,
        image: updatedUser.image,
      },
      SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      name: updatedUser.name,
      email: updatedUser.email,
      id: updatedUser._id,
      image: updatedUser.image,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const searchUserFromEvent = async (req, res) => {
  const { email } = req.query;
  try {
    const user = await Users.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        code: "USER_NOT_FOUND",
      });
    }
    res.status(200).json({
      email: user.email,
      image: user.image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const dumy = async (req, res) => {
  try {
    const file = req.files.file;
    const folder = `${req.user.name}_${req.user.id}`;

    const result = await uploadFile(file.data, folder);
    // const result = await deleteFile(
    //   "Daniel Oquendo_67d60cecb5343343abd08080/vlbpw2asfkzzbsr0xmo0"
    // );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const joinMeeting = async (req, res) => {
  const { roomName, userName } = req.body;

  if (!roomName || !userName) {
    return res.status(400).json({ code: "ROOM_NAME_OR_USER_NAME_MISSING" });
  }

  const token = await generateTokenLiveKit(userName, roomName);

  res.json({ token: token });
};

export const createMeeting = async (req, res) => {
  const { roomName, userName } = req.body;

  // Validar si faltan los parámetros necesarios
  if (!roomName || !userName) {
    return res.status(400).json({ code: "ROOM_NAME_OR_USER_NAME_MISSING" });
  }

  // Generar el token para el usuario y la sala
  const token = await generateTokenLiveKit(userName, roomName); // Esto debería devolver el JWT

  // Devolver la respuesta con el token y el link de la sala
  res.json({
    token, // El token ahora debería ser un JWT válido
    roomName,
    url: `${FRONTEND_URL}/planner/join-meeting?roomName=${roomName}&userName=${userName}`, // Link a la reunión en tu app
  });
};
