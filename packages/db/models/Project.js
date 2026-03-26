const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
    },

    repoUrl:{type:String,required:true},

    name:{type:String,required:true},

    slug:{type:String,required:true,unique: true},

    framework:{type:String,
        enum: ['nextjs', 'vite', 'cra', 'static'],
        default: 'static'
    },

    buildCmd:{type:String,default: 'npm run build'},

    outputDir:{type:String,default: 'dist'},

},{timestamps:true})

module.exports = mongoose.model('Project', projectSchema)