import { app } from "./app.js";
import dotenv from 'dotenv'
import { Connect_DB } from "./src/db/index.js";

dotenv.config({
    path: './env'
})

Connect_DB()
.then(
    ()=>{
        app.listen( 8000, ()=>{
            console.log(`server is running at port: 8000` )
        })
    }
)
.catch((err)=>{
    console.log(`DB Connection ERROR !!` , err)
})