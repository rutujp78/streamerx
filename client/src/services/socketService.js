import { io } from 'socket.io-client'

const token = localStorage.getItem("jwt_token");
const email = localStorage.getItem("email");

export const socketService = (data) => {
    return io('http://localhost:5000', {
    // return io('http://localhost:8080/stream-service', {
        autoConnect: false,
        auth: {
            token: token
        },
        query: {
            email: email,
            instaStreamURL: data.instaStreamURL,
            instaStreamKey: data.instaStreamKey,
            youtubeStreamURL: data.youtubeStreamURL,
            youtubeStreamKey: data.youtubeStreamKey,
        },
    });
};