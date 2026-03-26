const mongoose = require('mongoose')

const deploymentSchema = new mongoose.Schema({
    projectId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Project',
        required: true
    },
    status:{type:String,
        enum:['queued','building','ready','failed','cancelled'],
        default:'queued'},
    commitSha :{type:String,default:'manual'},
    commitMsg :{type:String,default:''},
    branch :{type:String,default:'main'},
    buildDuration:{type:Number,default: 0},
    artifactUrl:{type:String,default: null},
    logs:[{type:String}],
    error:{type:String,default: null},
    finishedAt:{type:Date,default: null}
},{timestamps:true})

module.exports = mongoose.model('Deployment', deploymentSchema)