const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5001;
const mongoose = require('mongoose');
const jwtAuth = require("./middleware/jwtAuth");
const cors = require("cors");
const { initKafka } = require("./configs/initKafka");
const { validateAndPrioritrize } = require("./controller/validateAndPrioritrize");
const { eurekaClient } = require("./configs/eurekaConfig");

app.use(express.json());
app.use(cors());
dotenv.config();

app.get("/", (req, res) => res.status(200).json({ status: true, data: { message: "Hello World From Notification-Service!" }}));
app.post("/send-notification", jwtAuth, validateAndPrioritrize);

app.listen(PORT || 5001, async() => {
    await mongoose.connect(process.env.MONGODB_URL);
    await initKafka();

    eurekaClient.start((error) => {
        if(error) {
            console.log('Error while registration with Eureka Server: ', JSON.stringify(error));
            if(error.response && error.response.body) console.log(JSON.stringify(error.response.body));
        }
        else {
            console.log('Eureka Registration Successful.');
        }
    });

    console.log('MongoDB Connected.');
    console.log("Validataion and Prioritization Server is running on " + PORT);
});