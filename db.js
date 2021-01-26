const uri = 'mongodb+srv://root:root@cluster0.mbavh.mongodb.net/wire?keepAlive=true&poolSize=30&autoReconnect=true&socketTimeoutMS=360000&connectTimeoutMS=360000'
const mongoose = require('mongoose')

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:'))
