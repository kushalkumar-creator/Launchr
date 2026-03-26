require('dotenv').config()
const express= require("express")
const cors= require("cors")
const {connectDB} = require('@launchr/db')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health',(req,res)=>{
    res.json( {status : "ok"})
})

async function startServer() {
    await connectDB()
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`Server running on port ${process.env.PORT || 4000}`)
    })
}

startServer()