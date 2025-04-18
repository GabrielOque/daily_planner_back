import Users from "../models/Users.js";
import Codes from "../models/Codes.js";

import { transporter } from "../libs/nodemailer.js";
import { sendCodeTemplate } from "../utils/templates.js";

export const sendCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({
      email: email,
    });
    if (!user) {
      return res.status(400).json({
        code: "USER_NOT_FOUND",
      });
    }

    //Update all codes valid to false
    const codes = await Codes.find({
      user: user._id,
      valid: true,
    });

    if (codes.length > 0) {
      await Codes.updateMany({ user: user._id, valid: true }, { valid: false });
    }

    const code = Math.floor(Math.random() * 1000000);

    const createCode = await Codes.create({
      code: code,
      user: user._id,
    });

    const template = sendCodeTemplate(user.name, createCode.code);

    const info = await transporter.sendMail({
      from: '"Daily Planner" <oquendodev@gmail.com>',
      to: `${email}`,
      subject: "Welcome",
      html: template,
    });

    res.status(200).json({
      code: code,
      info: info,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const verifyCode = async (req, res) => {
  const { code, email } = req.body;
  try {
    const user = await Users.findOne({
      email: email,
    });

    const codeDB = await Codes.findOne({
      user: user._id,
      code: code,
      valid: true,
    });

    if (!codeDB) {
      return res.status(400).json({
        code: "INVALID_CODE",
      });
    }
    const codeUpdated = await Codes.findByIdAndUpdate(codeDB._id, {
      valid: false,
    });
    res.status(200).json({
      code: codeUpdated,
    });
  } catch (error) {
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};

export const resendCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({
      email: email,
    });

    const codeDB = await Codes.findOne({
      user: user._id,
      valid: true,
    });

    await Codes.findByIdAndUpdate(codeDB._id, {
      valid: false,
    });
    const newCode = Math.floor(Math.random() * 1000000);

    const createCode = await Codes.create({
      code: newCode,
      user: user._id,
    });
    const template = sendCodeTemplate(user.name, createCode.code);
    const info = await transporter.sendMail({
      from: '"Daily Planner" <oquendodev@gmail.com>',
      to: `${email}`,
      subject: "Welcome",
      html: template,
    });
    res.status(200).json({
      code: createCode.code,
      info: info,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: "SERVER_ERROR",
    });
  }
};
