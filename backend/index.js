const express = require('express')
const cors = require('cors')
const slugify = require('slugify')
const fs = require('fs')
const app = express()
const port = 3000
const data = require('./entries.json')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/api/entries', function (req, res) {
  res.json(data.entries)
})

app.get('/api/entries/:slug', function (req, res) {
  const entry = data.entries.filter(e => e.slug === req.params.slug)
  if (entry.length === 0) {
    res.status(400).send({ message: 'Bad entry request' })
  } else {
    res.json(entry[0])
  }
})

app.post('/api/entries', function(req, res) {
  const name = req.body.name,
        desc = req.body.desc
  
  const entry = {slug: slugify(name, {lower: true}), name: name, desc: desc}
  data.entries.push(entry)
  fs.writeFile('entries.json', JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) return console.log(err)
    console.log(`Wrote ${JSON.stringify(entry)}`) })
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
  console.log(`entries:`)
  console.log(data.entries)
})