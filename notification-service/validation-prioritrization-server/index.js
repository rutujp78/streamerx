const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const { validateAndPrioritrize } = require("./controller/validateAndPrioritrize");
const jwtAuth = require("./middleware/jwtAuth");
const { initKafka } = require("./configs/initKafka");
const cors = require("cors");

app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));
app.post("/send-notification", jwtAuth, validateAndPrioritrize);

app.listen(PORT, async() => {
    await mongoose.connect(process.env.MONGODB_URL);
    await initKafka();
    console.log('MongoDB Connected.');
    console.log("Validataion and Prioritization Server is running on " + PORT);
});