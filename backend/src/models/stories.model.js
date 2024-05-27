import mongoose,{Schema} from 'mongoose'

const StoriesSchema = new Schema(
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

export const Stories = new mongoose.model('Stories',StoriesSchema)