import mongoose,{Schema} from 'mongoose'

const BlinkSchema = new Schema(
    {
        user:{
            type : Schema.Types.ObjectId,
            from : 'User'
        },
        file :{
            type : String
        },
        title : {
            type : String
        },
        link : [{
            heading: String,
            value : String
        }]
    },
    {timestamps: true}
)

export const Blink = new mongoose.model('Blink',BlinkSchema)