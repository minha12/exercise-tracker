const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid')
const cors = require('cors')
const path = require('path')  // Add this line
require('dotenv').config();

const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;
const mongoose = require('mongoose')
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(!err) console.log('Successfully connected to MongoDB')
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use('/public', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// Not found middleware
/*
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})
*/
// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

///////////////////////////MY APP////////////////////////////////
const Schema = mongoose.Schema
const appSchema = new Schema({
  userName: String,
  log: [{
    description: String,
    duration: Number,
    date: {type: Date, default: Date.now}
  }]
})
const Tracker = mongoose.model("Tracker", appSchema)

//Create a new user
app.post('/api/exercise/new-user', (req,res) => {
  //console.log('hehe')
  let newName = req.body.username
  console.log(newName)
  Tracker.findOne({userName: `${newName}`}, (err, data) => {
    if(err) return err
    //console.log('Creating user ...')
    if(data){
      res.send("Username was taken")
    } else {
      console.log('creating user ' + `${newName}`)
      let newUser = new Tracker({userName: newName })
      newUser.save((err, data) => {
        if(err) return err
        res.json({userName: data.userName, _id: data._id})
      })
    }
  })
})

//Add exercises
app.post('/api/exercise/add', (req, res) => {
  let userId = req.body.userId
  let description = req.body.description
  let duration = req.body.duration
  let date = req.body.date
  
  const log = {
    description: description,
    duration: duration,
    date: date
  }
  console.log(log)
  
  Tracker.findOneAndUpdate({_id: userId}, {log: log}, (err, data) => {
    if(err) return err
    res.send(data)
  })
})

//Request for log
app.get('/api/exercise/log', (req, res) => {
  const userId = req.query.userId
  const from = req.query.from ? new Date(req.query.from) : new Date('1970-01-01')
  //console.log(from)
  const to = req.query.to ? new Date(req.query.from) : new Date()
  const limit = req.query.limit
  
  Tracker.findById({_id: userId}, (err, data) => {
    if(err) return err
    if(data) {
      const dataLog = data.log
      console.log(dataLog)
      const filteredLog = dataLog.filter(item => (item.date >= from && item.date <= to))
      if(!isNaN(limit) && filteredLog.length >= limit) {
        filteredLog = filteredLog.slice(0, limit)
      }
      res.json({
        userName: data.userName,
        _id: data._id,
        from: req.query.from ? from : undefined,
        to: req.query.to ? to : undefined,
        count: filteredLog.length,
        log: filteredLog
      })
    } else {
      res.send('In correct ID, please give an correct ID')
    }
  })
})
//Request for all users
app.get('/api/exercise/users', (req, res) => {
  Tracker.find({}, {log: false}, (err, data) => {
    if(err) return err
    res.json(data)
  })
})
/////////////////////////////////////////////////////////////////

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
