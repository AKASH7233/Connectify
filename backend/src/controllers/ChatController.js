import ChatModel from "../models/ChatModel.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js"
export const createChat = async (req, res,next) => {
    // console.log('request for chat', req.body)
    if(!req.body.senderId  || !req.body.receiverId) return next(new ApiError('Sender and receiver id is required', 400));
    try {
    
    if(req.body.senderId == req.body.receiverId) return next(new ApiError('You cannot chat with yourself', 400))
    
    const findIdsValid = await User.find({_id: { $in: [req.body.senderId, req.body.receiverId]}})
    if(findIdsValid.length !== 2) return next(new ApiError('Sender and receiver id is not valid', 400))

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

export const userChats = async (req, res, next) => {
    try {
        console.log('userId from chatcontroller',req.params.userId);
        const FindReceiver = (await ChatModel.find({
            member: { $in: [req.params.userId] }
        })).map(chat => chat.member)
        // console.log('find chat patner length',FindReceiver)

        const selectReciverId = (findChatPatner) => findChatPatner.map(chat => chat[1].toString())

        // const chats = await ChatModel.aggregate([
        //     {
        //         $match: {
        //             member: { $in: [userId] }
        //         }
        //     }, {
        //         $addFields: {
        //             personId: { $arrayElemAt: ["$member", 1] }
        //         }
        //     }
        // ])

        let users = [];
        for (let id of selectReciverId(FindReceiver)) {
            const user = await User.findById({ _id: id }).select('username fullName _id profileImage email')
            console.log('id from ',id)
        if(id!=req.params.userId && user){
            users.push(user)
        }
        }
        console.log('final answer for partner', users)

        res.status(200).json(users)
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
}

export const findChat = async (req, res,next) => {
    try {
        // console.log('request for chat', req.params)
        const chat = await ChatModel.findOne({
            member: { $all:[req.params.firstUserId, req.params.secondUserId]}
        })
        res.status(200).json(chat)
    } catch (error) {
        return next(new ApiError(error.message, 500))
    }
}