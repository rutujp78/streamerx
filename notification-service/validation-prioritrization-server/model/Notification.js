const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'userId is required.']
    },
    from: {
        type: String,
        required: [true, 'email is required.']
    },
    to: {
        type: [String],
        required: [true, 'receivers are required.']
    },
    content: {
        type: Object,
        required: [true, 'content is required.']
    },
    type: {
        type: String,
        required: [true, 'type is required.']
    },
    priority: {
        type: String,
        required: [true, 'priority is required.']
    },
    time: {
        type: Date,
        required: [true, 'time is required.']
    },
    status: {
        type: String,
        required: [true, 'status is required.']
    },
    retryCount: {
        type: Number,
        default: 0
    }    
});

const Notification = mongoose.model('notification', notificationSchema);

module.exports = Notification;