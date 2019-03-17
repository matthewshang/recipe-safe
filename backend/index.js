const cors     = require('cors')
const express  = require('express')
const fs       = require('fs')
const kue      = require('kue')
const mongoose = require('mongoose')
const path     = require('path')
const shortid  = require('shortid')
const slugify  = require('slugify')
const webshot  = require('webshot')

const app = express()
const port = 3000

const queue = kue.createQueue()
const imageIdToJobId = {}

kue.Job.range(0, -1, 'desc', (err, jobs) => {
  jobs.forEach((job) => {
    imageIdToJobId[job.data.id] = job.id
  })
})

function takeScreenshot(data, done) {
  let isErr = false
  const path = `images/${data.id}.png`
  const options = {
    captureSelector: '#articleContent',
    shotSize: {
      width: 'window',
      height: 'all'
    }
  }
  webshot(data.url, path, options, (err) => {
    if (err) {
      console.log(err)
      return done(new Error('could not take screenshot'))
    } else {
      console.log(`Saved ${data.url} to ${path}`)
      done()
    }
  })
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
    slug: String,
    imageId: String
  })
  const Entry = mongoose.model('Entry', entrySchema)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/entries', (req, res) => {
  const Entry = mongoose.model('Entry')
  const query = Entry.find({}, 'name desc slug imageId -_id', (err, entries) => {
    if (err) return next(err)
    res.send(entries)
  })
})

app.get('/api/entries/:slug', (req, res) => {
  const Entry = mongoose.model('Entry')
  Entry.findOne({ 'slug': req.params.slug }, '-_id -__v', (err, entry) => {
    if (err) return next(err)
    if (!entry) res.status(400).send({ 'error': 'Bad entry request' })
    else res.send(entry)
  })
})

app.post('/api/entries', (req, res) => {
  const name = req.body.name,
        url = req.body.url,
        desc = req.body.desc
  const Entry = mongoose.model('Entry')
  const slug = slugify(name, {lower: true})
  const id = url ? shortid.generate() : ''

  if (url) {
    const job = queue.create('screenshot', {
      title: name,
      url: url,
      id: id
    }).save(() => {
      imageIdToJobId[id] = job.id
    })
  }

  const entry = new Entry({
    slug: slug,
    name: name,
    desc: desc,
    imageId: id 
  })
  entry.save((err, e) => {
    if (err) return console.error(err)
    console.log(`Saved ${e} to db`)
  })

  res.header('slug', slug)
    .set('Access-Control-Expose-Headers', 'slug')
    .end()
})

app.get('/api/images/:id', (req, res) => {
  const id = req.params.id
  const p = path.join(__dirname, './images', id + '.png')
  if (fs.existsSync(p)) {
    res.sendFile(p)
  } else {
    res.status(404).end()
  }
})

app.get('/api/imagestatus/:id', (req, res) => {
  const imageId = req.params.id
  const id = imageIdToJobId[imageId]
  if (id) {
    kue.Job.get(id, (err, job) => {
      if (err) res.status(500).end()
      else res.send({ exists: job.state() === 'complete' })
    })
  } else {
    res.send({ exists: false })
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('Something went wrong.')
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})