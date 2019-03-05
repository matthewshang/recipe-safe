const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000
const data = require('./entries.json')

app.use(cors())

app.get('/api/entries', function(req, res) {
  res.json(data.entries)
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}!`)
    console.log(`entries:`)
    console.log(data.entries)
})