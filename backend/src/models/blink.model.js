import mongoose,{Schema} from 'mongoose'

const BlinkSchema = new Schema(
    {
        user:{
            type : Schema.Types.ObjectId,
            from : 'User'
        },
        story: [
            {
                file :[ {
                    type : String
                }],
                title : [{
                    type : String
                }],
                link : [{
                    heading: String,
                    link : String
                }]
            },
        ]
    },
    {timestamps: true}
)

export const Blink = new mongoose.model('Blink',BlinkSchema)