const express = require('express')
const cors = require('cors')
const slugify = require('slugify')
const mongoose = require('mongoose')

const app = express()
const port = 3000

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

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('Something went wrong.')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})