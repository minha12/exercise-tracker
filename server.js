const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const shortid = require('shortid')
const cors = require('cors')

process.env.MONGO_URI = 'mongodb+srv://minhha-db:minhha89@cluster0-7zk5p.mongodb.net/test?retryWrites=true&w=majority'
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(!err) console.log('Sucessfully connected to MongoDB')
})

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
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
  userId: String,
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
      let newUser = new Tracker({userName: newName, userId: shortid.generate() })
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
  const from = req.query.from
  const to = req.query.to
  const fromD = new Date(from)
  const toD = new Date(to)
  
  Tracker.findById({_id: userId}, (err, data) => {
    if(err) return err
    if(from) {
      const filteredData = {
        userName: data.userName,
        userId: data.userId,
        log: []
      }
      data.log.map(item => {
        const dateD = new Date(item.date)
        if(dateD.isAfter(fromD) && dateD.isBefore(toD)) {
          filteredData.log.push(item)
        }
      })
      res.send(filteredData)
    } else {
      res.send(data)
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
  console.log('Your app is listening on port ' + listener.address().port)
})
