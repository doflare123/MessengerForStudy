const mongoose = require('mongoose');

const notifications = new mongoose.Schema({
    user_id: String,
    status: Boolean,
    messege_id: String
});
const notification = mongoose.model('messeges', notifications);

module.exports = notification;