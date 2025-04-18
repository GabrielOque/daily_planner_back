import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import Codes from "../models/Codes.js";
import { SECRET_KEY } from "../config.js";
import { uploadFile, deleteFile } from "../libs/cloudinary.js";

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
    token: token,
  });
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
