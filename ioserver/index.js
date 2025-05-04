import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import socketServer from './socketServer.js';
import eurekaClient from './config/eurekaConfig.js';

const app = express();
app.use(cors({ origin: '*' }));
dotenv.config();

const httpServer = http.createServer(app);

socketServer(httpServer);

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: { message: 'Hello World From Stream-Service!' }
    });
});

httpServer.listen(5000, () => {
    eurekaClient.start((error) => {
        if(error) {
            console.log('Error while registration with Eureka Server: ', JSON.stringify(error));
            if(error.response && error.response.body) console.log(JSON.stringify(error.response.body));
        }
        else {
            console.log('Eureka Registration Successful.');
        }
    });

    console.log('App listining to port 5000');
});