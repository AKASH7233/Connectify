import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    chatId:{
        type: String,
    },
    senderId:{
        type: String,
    },
    message:{
        type: String,
    }
},{
    timestamps: true
});

const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;