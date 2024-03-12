import express from 'express'
import cors from 'cors'
import  cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:false}))


//Route Setup
import router from './src/routes/user.route.js'
import postrouter from './src/routes/post.route.js'
import likeRouter from "./src/routes/like.route.js"
import commentRouter from "./src/routes/comment.route.js" 
import searchRouter from "./src/routes/search.route.js"
import followRouter from "./src/routes/follow.route.js"


app.use('/api/v1/user', router)
app.use('/api/v1/post', postrouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/follow', followRouter)
//http://localhost:8000/api/v1/user/register

export {app}