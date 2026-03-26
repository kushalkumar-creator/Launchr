require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })
const express= require("express")
const cors= require("cors")
const {connectDB} = require('@launchr/db')
const passport = require('passport')

const app = express()
// middlewares
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
//routes
app.use('/api/projects', require('./routes/projects'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/deployments', require('./routes/deployments'))
//health check
app.get('/health',(req,res)=>{
    res.json( {status : "ok"})
})

//start
async function startServer() {
    await connectDB()
    app.listen(process.env.PORT || 4000,()=>{
        console.log(`Server running on port ${process.env.PORT || 4000}`)
    })
}

startServer()