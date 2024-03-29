import MessageModel from '../models/MessageModel.js';
import {ApiError} from '../utils/ApiError.js';

export const addMessage = async (req, res, next) => {
    try {
        const { chatId, senderId, text } = req.body;
        const newMessage = new MessageModel({
            chatId,
            senderId,
            message: text
        });
        const message = await newMessage.save();
        res.status(201).json(message);
        // "_id": "6606d74546c624cf06749211"
    } catch (error) {
        return next(new ApiError(error.message, 500));
    }
}

export const getMessages = async (req, res, next) => {
    try {
        const {chatId } = req.params;
        const message = await MessageModel.find({ chatId });
        res.status(200).json(message);
    } catch (error) {
        return next(new ApiError(error.message, 500));
    }
}