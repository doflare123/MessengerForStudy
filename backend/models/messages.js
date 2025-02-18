const mongoose = require('mongoose');

const messeges = new mongoose.Schema({
    sender_id: String,
    receiver_id: String,
    message_content: String,
    data: String,
    tine: String,
    status: Boolean
});

messeges.index({ sender_id: 1, receiver_id: 1, time: -1 });
const messege = mongoose.model('messeges', messeges);

module.exports = messege;