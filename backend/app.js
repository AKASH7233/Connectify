import express from 'express'
import cors from 'cors'
import  cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());


const allowedOrigins = [
    'https://connectify-six.vercel.app',
    'https://connectify-omega.vercel.app',
    'https://connectify-socket-wixg.onrender.com',
    'http://localhost:5173'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

//Route Setup
import router from './src/routes/user.route.js'
import postrouter from './src/routes/post.route.js'
import likeRouter from "./src/routes/like.route.js"
import commentRouter from "./src/routes/comment.route.js" 
import searchRouter from "./src/routes/search.route.js"
import followRouter from "./src/routes/follow.route.js"
import chatRouter from "./src/routes/ChatRoute.js"
import messageRouter from "./src/routes/MessageRouter.js"
import bookmarkRouter from "./src/routes/Bookmark.route.js"
import blinkRouter from "./src/routes/blink.route.js"

import errorMiddleware from './src/middlewares/error.middleware.js'


app.use('/api/v1/user', router)
app.use('/api/v1/post', postrouter)
app.use('/api/v1/like', likeRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/search', searchRouter)
app.use('/api/v1/follow', followRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/message', messageRouter)
app.use('/api/v1/bookmark', bookmarkRouter)
app.use('/api/v1/blink', blinkRouter)

app.get('/', (req,res) => {
    res.send("Welcome to Connectify API")
})

//http://localhost:8000/api/v1/user/register
app.use(errorMiddleware)

export {app}
