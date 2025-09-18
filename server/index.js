const express = require('express');
const connectToDB = require('./config/db');
require('dotenv').config();
var cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require('./middlewares/error.middleware');
const authRouter = require('./routes/auth.route');
const advocateRouter = require('./routes/advocate.route');
const bookingRouter = require('./routes/booking.route');
const documentRouter = require('./routes/document.routes');
const documentTemplateRouter = require('./routes/documentTemplate.routes');
const caseRouter = require('./routes/case.routes');

const app = express();

let PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

connectToDB();

app.use('/api/auth', authRouter);
app.use('/api/advocates', advocateRouter);
app.use('/api/bookings', bookingRouter);
app.use("/api/documents", documentRouter);
app.use("/api/document-templates", documentTemplateRouter);
app.use('/api/cases', caseRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})