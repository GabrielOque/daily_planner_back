import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
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
        message: "User already exists",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
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
      result,
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
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
