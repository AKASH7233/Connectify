import MessageModel from '../models/MessageModel.js';
import {ApiError} from '../utils/ApiError.js';

export const addMessage = async (req, res, next) => {
    try {
        // console.log('request for add message', req.body);
        if(!req.body.chatId || !req.body.senderId || !req.body.text) return next(new ApiError('Invalid input', 400));
        // console.log(req.body);
        const { chatId, senderId, text } = req.body;
        const newMessage = new MessageModel({
            chatId,
            senderId,
            message: text
        });
        const message = await newMessage.save();
        // console.log(message);
        res.status(201).json(message);
        // "_id": "6606d74546c624cf06749211"
    } catch (error) {
        return next(new ApiError(error.message, 500));
    }
}

export const getMessages = async (req, res, next) => {
    try {
        // console.log('request for get message')
        const {chatId } = req.params;
        const message = await MessageModel.find({ chatId });
        // console.log('get message output', message);
        res.status(200).json(message);
    } catch (error) {
        return next(new ApiError(error.message, 500));
    }
}