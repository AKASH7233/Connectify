import mongoose,{Schema} from "mongoose";

const postSchema = new Schema(
    {
        postFile:{
            type: String,
            required: true
        },
        title: {
            type: String,
            required : true
        },
        duration:{
            type:Number
        },
        postedBy : {
            type : Schema.Types.ObjectId,
            ref: "User"
        },
        isPublished: {
            type: Boolean
        },
        commentedBy:[
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            }
        ]
    },
    {timestamps: true}
)

export const Post = mongoose.model("Post", postSchema)