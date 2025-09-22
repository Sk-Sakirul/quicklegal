require("dotenv").config();
const express = require("express");
const connectToDB = require("./config/db");
var cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/error.middleware");
const authRouter = require("./routes/auth.route");
const advocateRouter = require("./routes/advocate.route");
const bookingRouter = require("./routes/booking.route");
const documentRouter = require("./routes/document.routes");
const documentTemplateRouter = require("./routes/documentTemplate.routes");
const caseRouter = require("./routes/case.routes");
const adminRouter = require("./routes/admin.route");
const cors = require("cors");

const app = express();

let PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== "test") {
  connectToDB();
}

const url = process.env.BASE_URL;

app.use(
  cors({
    origin: `${url}`,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/advocates", advocateRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/documents", documentRouter);
app.use("/api/document-templates", documentTemplateRouter);
app.use("/api/cases", caseRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
}