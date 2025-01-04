const mongoose = require('mongoose');

const messeges = new mongoose.Schema({
    sender_id: String,
    receiver_id: String,
    message_content: String,
    data: String,
    tine: String,
    status: Boolean
});
const messege = mongoose.model('messeges', messeges);

module.exports = messege;