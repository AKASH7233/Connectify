import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        },
        comment: {
            type: String,
            required : true
        },
        commentedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {timestamps:true}
)

export const Comment = mongoose.model("Comment" , commentSchema)