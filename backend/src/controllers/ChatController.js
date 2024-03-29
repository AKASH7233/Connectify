import ChatModel from "../models/ChatModel.js";
import { ApiError } from "../utils/ApiError.js";

export const createChat = async (req, res,next) => {
    try {
    
    const previousChat = await ChatModel.findOne({
        member: { $all:[req.body.senderId, req.body.receiverId]}
    })

    if(previousChat) return res.status(200).json(previousChat)

    const newChat = new ChatModel({
        member: [req.body.senderId, req.body.receiverId]
    })
    const chat = await newChat.save();
    res.status(200).json(chat)
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
    //  "_id": "6606cf15d66ec4bbbc422e38"
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

export const findChat = async (req, res,next) => {
    try {
        const chat = await ChatModel.findOne({
            member: { $all:[req.params.firstUserId, req.params.secondUserId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
}