const mongoose = require('mongoose')

let isConnected = false

async function connectDB(params) {
    try {
        if(isConnected){
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on('connected', () => {
        console.log("Mongoose connected to DB");
        });
        isConnected=true
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error)
        process.exit(1);
    }
}

module.exports = { connectDB }