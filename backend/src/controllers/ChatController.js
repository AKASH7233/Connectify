import ChatModel from "../models/ChatModel.js";
import { ApiError } from "../utils/ApiError.js";

export const createChat = async (req, res,next) => {
    const newChat = new ChatModel({
        member: [req.body.senderId, req.body.receiverId]
    })
    try {
        const chat = await newChat.save();
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
}

export const userChats = async (req, res,next) => {
    try {
        const chat = await ChatModel.find({
            member: { $in:[req.params.userId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
}