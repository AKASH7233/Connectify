import mongoose from 'mongoose';

const { Schema } = mongoose;

const ChatSchema = new Schema({
    member: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }]
}, {
    timestamps: true
})

const ChatModel = mongoose.model('Chat', ChatSchema);

export default ChatModel;