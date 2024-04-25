import mongoose,{Schema} from "mongoose";

const bookMarkSchema = new Schema(
    {
        post:{
            type : Schema.Types.ObjectId,
            ref : 'Post'
        },
        bookedBy:{
            type: Schema.Types.ObjectId,
        }
    }
)

export const BookMark = mongoose.model('BookMark',bookMarkSchema)