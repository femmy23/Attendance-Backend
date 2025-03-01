const express = require("express");
const {
  signupUser,
  loginUser,
  logoutUser,
  authMiddleware,
  verifyUser,
} = require("../../controller/auth/authController");

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify/:userId/:uniqueString", verifyUser);
router.get("/checkAuth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User Authenticated!",
    user,
  });
});

module.exports = router;
