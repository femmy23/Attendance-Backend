const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./route/auth/authRoute");

const moderatorAttendeeRouter = require("./route/moderator/attendeeRoute");
const moderatorAttendanceRouter = require("./route/moderator/attendanceRoute");
const moderatorCellRouter = require("./route/moderator/cellRoute");
const moderatorMemberRouter = require("./route/moderator/memberRoute");

const adminCellRouter = require("./route/admin/cellRouter");
const adminModeratorRouter = require("./route/admin/moderatorRoute");
const adminMemberRouter = require("./route/admin/memberRoute");
const adminAttendeeRouter = require("./route/admin/attendeeRoute");
const adminAttendanceStatRouter = require("./route/admin/attendanceStatsRoute");

const superAdminLocationRouter = require("./route/superAdmin/locationRoute");
const superAdminCellRouter = require("./route/superAdmin/cellRoute");
const superAdminAttendanceStatRouter = require("./route/superAdmin/attendanceStatRoute");
// const superAdminMemberRouter = require("./route/superAdmin/cellRoute");

const superiorBranchRouter = require("./route/superior/branchRoute");
const superiorLocationRouter = require("./route/superior/locationRoute");
const superiorAttendanceStatRouter = require("./route/superior/attendanceStatRoute");
const HeadquarterRouter = require("./route/superior/headquarterRoute");

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//create a database
mongoose
  .connect(
    "mongodb+srv://femmy:Tb3vNZspBGoSEVSw@attendacetracker.2imhh.mongodb.net/?retryWrites=true&w=majority&appName=AttendaceTracker"
  )
  .then(() => console.log("Database Connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: [
      "content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.json());

//Auth
app.use("/api/auth", authRouter);

//moderator
app.use("/api/moderator/attendee", moderatorAttendeeRouter);
app.use("/api/moderator/attendance", moderatorAttendanceRouter);
app.use("/api/moderator/cell", moderatorCellRouter);
app.use("/api/moderator/member", moderatorMemberRouter);

//admin
// app.use("/api/admin/moderator", adminModeratorRouter);
app.use("/api/admin/cell", adminCellRouter);
app.use("/api/admin/moderator", adminModeratorRouter);
app.use("/api/admin/member", adminMemberRouter);
app.use("/api/admin/attendee", adminAttendeeRouter);
app.use("/api/admin/attendanceStats", adminAttendanceStatRouter);

//super admin
app.use("/api/superAdmin/location", superAdminLocationRouter);
app.use("/api/superAdmin/cell", superAdminCellRouter);
app.use("/api/superAdmin/attendanceStats", superAdminAttendanceStatRouter);

//superior
app.use("/api/superior/branch", superiorBranchRouter);
app.use("/api/superior/location", superiorLocationRouter);
app.use("/api/superior/attendanceStats", superiorAttendanceStatRouter);
app.use("/api/superior/headquarter", HeadquarterRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
