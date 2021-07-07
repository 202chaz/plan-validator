const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))
app.use(express.json())


app.get('/', (req, res) => {
  res.send('home')
})

app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})