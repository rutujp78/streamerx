import jwt from 'jsonwebtoken';
import liveStream from './utils/liveStream.js';
import { Server } from 'socket.io';

const socketServer = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: 'http://localhost:5173',
        }
    });
    const streamws = io.of('/stream');
    
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        const email = socket.handshake.query.email;

        if(!token || !email) {
            return next(new Error("Authentication details missing."));
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode, 'email' , email );
            if(decode.email === email) {
                socket.user = decode;
                next();
            }
            else {
                console.log('Socket auth error');
                return next(new Error('Invalid token'));
            }
        } catch (error) {
            console.log('Socket auth error:', error.message);
            return next(new Error('Invalid token'));
        }
    });

    io.on('connection', socket => {
        console.log('Socket Connected', socket.id);
        const payload = socket.handshake.query;
        // console.log(payload);
    
        const instaStreamCode = payload.instaStreamURL + payload.instaStreamKey;
        const youtubeStreamCode = payload.youtubeStreamURL + "/" + payload.youtubeStreamKey;
        // console.log(instaStreamCode, youtubeStreamCode);
    
        const ffmpegProcessInsta = instaStreamCode.length > 10 ? liveStream({ streamCode: instaStreamCode, platform: "instagram" }) : null;
        const ffmpegProcessYoutube = youtubeStreamCode.length > 10 ? liveStream({ streamCode: youtubeStreamCode, platform: "youtube" }) : null;
    
        socket.on('binarystream', stream => {
            console.log('Incoming binary stream', stream);
            // if (ffmpegProcessInsta) {
            //     ffmpegProcessInsta.stdin.write(stream, (err) => {
            //         console.log('Err', err);
            //     });
            // }
            // if (ffmpegProcessYoutube) {
            //     ffmpegProcessYoutube.stdin.write(stream, (err) => {
            //         console.log('Err', err);
            //     });
            // }
        });
    });
}

export default socketServer;