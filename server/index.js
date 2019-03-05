const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const data = require('./entries.json')

app.use(cors())

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
  console.log(`entries:`)
  console.log(data.entries)
})