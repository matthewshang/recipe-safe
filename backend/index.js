const cors     = require('cors')
const express  = require('express')
const fs       = require('fs')
const kue      = require('kue')
const mongoose = require('mongoose')
const path     = require('path')
const shortid  = require('shortid')
const slugify  = require('slugify')
const webshot  = require('webshot')

const utils = require('./utils.js')

const app = express()
const port = 3000

const queue = kue.createQueue()
const idMap = {}

kue.Job.range(0, -1, 'desc', (err, jobs) => {
  jobs.forEach((job) => {
    idMap[job.data.id] = job.id
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
      mongoose.model('Entry').findOneAndUpdate({ imageId: data.id }, { imageId: '' }, (er) => {
        if (er) console.log(er)
      })
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
    imageId: String,
    ingredients: [String],
    steps: [String]
  })
  const Entry = mongoose.model('Entry', entrySchema)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/entries', (req, res) => {
  mongoose.model('Entry').find({}, 'name desc slug imageId -_id', (err, entries) => {
    if (err) return next(err)
    res.send(entries)
  })
})

app.post('/api/entries', (req, res) => {
  const name = req.body.name,
        url = req.body.url,
        desc = req.body.desc
  const slug = slugify(name, {lower: true})
  let id = url ? shortid.generate() : ''

  if (url) {
    if (utils.isURL(url)) {
      const job = queue.create('screenshot', {
        title: name,
        url: url,
        id: id
      }).save(() => {
        idMap[id] = job.id
      })
    } else {
      id = ''
    }
  }

  new mongoose.model('Entry')({
    slug: slug,
    name: name,
    desc: desc,
    imageId: id,
    ingredients: ['1 egg', '8 cups of flour'],
    steps: ['Boil a pot of water', 'Eat'] 
  })
  .save((err, e) => {
    if (err) return console.error(err)
    console.log(`Saved ${e} to db`)
  })

  res.header('slug', slug)
    .set('Access-Control-Expose-Headers', 'slug')
    .end()
})

app.get('/api/entries/:slug', (req, res) => {
  mongoose.model('Entry').findOne({ 'slug': req.params.slug }, '-_id -__v', (err, entry) => {
    if (err) return next(err)
    if (!entry) res.status(400).send({ 'error': 'Bad entry request' })
    else res.send(entry)
  })
})

app.post('/api/entries/update/:slug', (req, res) => {
  const slug = req.params.slug
  const query = { 'slug': slug }
  const update = { '$push': {}}
  if (req.body.ingredient) update.$push.ingredients = req.body.ingredient
  if (req.body.step) update.$push.steps = req.body.step
  console.log(JSON.stringify(update))

  mongoose.model('Entry').findOneAndUpdate(query, update, (err) => {
    if (err) console.log(err)
    else console.log(`Updated entry at ${slug}`)
  })
})

app.post('/api/entries/delete/:slug', (req, res) => {
  const slug = req.params.slug
  mongoose.model('Entry').deleteOne({ slug: slug }, (err) => {
    if (err) console.log(err)
    else console.log(`Deleted entry at ${slug}`)
  })
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
  const id = idMap[imageId]
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