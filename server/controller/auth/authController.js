const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const User = require("../../model/userModel");
const UserVerification = require("../../model/userVerification");
const Cell = require("../../model/cell");

//register controller
const signupUser = async (req, res) => {
  const {
    name,
    email,
    phone,
    sex,
    marriageAnniversary,
    dateOfBirth,
    address,
    password,
  } = req.body;

  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({
        success: false,
        message: "User Already Exist with that email",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      phone,
      sex,
      dateOfBirth,
      marriageAnniversary,
      address,
      password: hashPassword,
      verified: false,
    });
    await newUser.save();

    //Verify Email
    // sendVerificationEmail(result, res);

    res.status(200).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//
// Send Verification
//

const sendVerificationEmail = ({ _id, email }, res) => {
  const currentUrl = "/";

  const uniqueString = uuidv4() + _id;

  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email Address to Complete the signup and login into your Account.<p>This link <b>expire in 6 hours</b></p> Press <a href=${
      currentUrl + "auth/verify/" + _id + "/" + uniqueString
    }>here</a> to proceed </p>`,
  };

  //hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(uniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const newVerification = new UserVerification({
        userId: _id,
        uniqueString: hashedUniqueString,
        createdAt: Date.now(),
        expiresAt: Date.now() + 21600000,
      });

      newVerification.save().then(() => {
        transporter
          .sendMail(mailOptions)
          .then(() => {
            res.json({
              status: "Pending",
              message: "verification Email Sent!",
            });
          })
          .catch((error) => {
            console.log(error);
            res.json({
              status: "FAILED",
              message: "Couldn't Save verification email data!",
            });
          });
      });
    })
    .catch(() => {
      res.json({
        status: "FAILED",
        message: "An error occurred while hashing email data!",
      });
    });
};

// verify Email
const verifyUser = async (req, res) => {
  let { userId, uniqueString } = req.params;

  UserVerification.find({ userId })
    .then(() => {
      console.log("done successfully ");
    })
    .catch((error) => {
      console.log(error);
    });
};

//
//login User
//
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User Doesn't Exist. Please Register",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );

    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password! Please try again",
      });
    }
    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser.email,
        role: checkUser.role,
        name: checkUser.name,
        phone: checkUser.phone,
        sex: checkUser.sex,
        marriageAnniversary: checkUser.marriageAnniversary,
        address: checkUser.address,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Logged In Successfully",
        user: {
          id: checkUser._id,
          email: checkUser.email,
          role: checkUser.role,
          name: checkUser.name,
          phone: checkUser.phone,
          sex: checkUser.sex,
          marriageAnniversary: checkUser.marriageAnniversary,
          address: checkUser.address,
        },
      });

    console.log(res.cookies);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//
//logout
//
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged Out Successfully",
  });
};

//
//Auth
//
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized User",
    });

  try {
    const decode = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Unauthorized User",
    });
  }
};

//
//otp
//

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Ready for Message");
//     console.log(success);
//   }
// });

// const sendOTP = async ({ _id, email }, res) => {
//   try {
//     const otp = `${Math.floor(1000 + Math.random() * 9000)}  `;

//     const mailOptions = {
//       from: process.env.AUTH_EMAIL,
//       to: email,
//       html: `<p>Enter <b>${otp}</b> in the app to verify your email address and Complete  </p>, <p>This code expires in 1 hour</p>`,
//     };

//     //
//     //
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized User",
//     });
//   }
// };

const sendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It expires in 10 minutes.`,
    });
    res.json({ message: "OTP sent successfully" });

    //
    //
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "Error",
    });
  }
};

//
//verify otp
//
// const verifyOTP = async (req, res) => {
//   const { email, otp } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
//       return res.status(400).json({ error: "Invalid or expired OTP" });
//     }

//     // Clear OTP after verification
//     user.otp = null;
//     user.otpExpires = null;
//     await user.save();

//     // Generate JWT token
//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ message: "OTP sent successfully" });

//     //
//     //
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized User",
//     });
//   }
// };

module.exports = {
  signupUser,
  loginUser,
  logoutUser,
  authMiddleware,
  verifyUser,
};
