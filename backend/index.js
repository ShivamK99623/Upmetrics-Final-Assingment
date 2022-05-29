const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors') 
connectToMongo();
const app = express()
const port = 5000
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(express.json())
// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.listen(port, () => {
  console.log(`Up-metrics listening on at http://localhost:${port}`)
})