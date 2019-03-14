const cors     = require('cors')
const express  = require('express')
const kue      = require('kue')
const mongoose = require('mongoose')
const shortid  = require('shortid')
const slugify  = require('slugify')
const webshot  = require('webshot')

const app = express()
const port = 3000

const queue = kue.createQueue()

function takeScreenshot(data, done) {
  var isErr = false
  const path = `screenshots/${data.id}.png`
  webshot(data.url, path, (err) => {
    if (err) {
      console.error(err)
      isErr = true
    } else {
      console.log(`Saved ${data.url} to ${path}`)
    }
  })

  if (isErr) return done(new Error('could not take screenshot'))
  else done()
}

queue.process('screenshot', (job, done) => {
  console.log(`Processing job ${JSON.stringify(job.data)}`)
  takeScreenshot(job.data, done)
})

mongoose.connect('mongodb://localhost:27017/entries', { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('Connected to db!')

  const entrySchema = new mongoose.Schema({
    name: String,
    desc: String,
    slug: String
  })
  const Entry = mongoose.model('Entry', entrySchema)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/entries', (req, res) => {
  const Entry = mongoose.model('Entry')
  const query = Entry.find({}, 'name desc slug', (err, entries) => {
    if (err) return next(err)
    res.send(entries)
  })
})

app.get('/api/entries/:slug', (req, res) => {
  const Entry = mongoose.model('Entry')
  Entry.findOne({ 'slug': req.params.slug }, 'name desc', (err, entry) => {
    if (err) return next(err)
    if (!entry) res.status(400).send({ 'error': 'Bad entry request' })
    else res.send(entry)
  })
})

app.post('/api/entries', (req, res) => {
  const name = req.body.name,
        desc = req.body.desc
  const Entry = mongoose.model('Entry')

  const entry = new Entry({
    slug: slugify(name, {lower: true}),
    name: name,
    desc: desc
  })
  entry.save((err, e) => {
    if (err) return console.error(err)
    console.log(`Saved ${e} to db`)
  })
})

app.post('/api/backup', (req, res) => {
  const url = req.body.url
  const id = shortid.generate()

  const job = queue.create('screenshot', {
    url: url,
    id: id
  }).save()

  res.status(202)
  res.header('Location', `queue/${id}`)
  res.set('Access-Control-Expose-Headers', 'Location')
  res.end()
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('Something went wrong.')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})