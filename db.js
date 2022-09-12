const Mongoose = require('mongoose')
const RemoteDB = 'mongodb+srv://awnnlol:passwordz123@cluster0.go9pe2u.mongodb.net/?retryWrites=true&w=majority'
const connectDB = async () => {
    await Mongoose.connect(RemoteDB)
    .then(client => {
        console.log('MongoDB connection successful')
    })
}

module.exports = connectDB