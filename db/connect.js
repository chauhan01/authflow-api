const mongoose = require('mongoose')

mongoose.set({strictQuery:true})

const connectDB = (URL)=>{
    return mongoose.connect(URL)
}

module.exports = connectDB