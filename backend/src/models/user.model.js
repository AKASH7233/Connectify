import mongoose,{Schema} from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema(
    {
        username:{ 
            type : String,
            required : true,
            unique : true
        },
        fullName: {
            type : String,
            required: true,
        },
        email: {
            type : String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true
        },
        coverImage: {
            type : String
        },
        ProfileImage : {
            type: String
        },
        Description: {
            type: String
        },
        refreshToken:{
            type: String
        },
        posts: [
            {
                type : Schema.Types.ObjectId,
                ref : "Post"
            }
        ]

    },
    {timestamps: true}
)

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,8)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username: this.username,
            password: this.password,
            email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}




export const User = mongoose.model("User", userSchema)