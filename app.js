const express = require('express')
const app = express()
const port = 3000
const path = require("path")
const fs = require("fs")
const pdf2excel = require('pdf-to-excel')
let PDFParser = require("pdf2json")
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname );
  }
})
const uploader = multer({ storage: storage})


app.use(express.static('public'))
app.use(express.json())

const clearDir = (uploadPath) => {
  const file = fs.existsSync(uploadPath)
  if (file) {
    fs.unlink(uploadPath, (err) => {
      if (err) {
        console.log(err)
        return
      }
    })
  }
}

const sbcUpload = (req, res, next) => {
  const pdfParser = new PDFParser()
  const file = req.file
  const path = file.path
  const name = file.fieldname
  const hash = {}
  let count = 0

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {
    pdfData.formImage['Pages'].map((page, index) => {
      if (index === 0) {
        page['Texts'].map((text, index) => {
          if (index === 56) hash['inNetworkIndividualDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[1]
          if (index === 57) hash['inNetworkFamilyDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[0]
          if (index === 58) hash['outOfNetworkIndividualDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[0]
          if (index === 58) hash['outOfNetworkFamilyDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[2]
          if (index === 139) hash['inNetworkIndividualOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[2]
          if (index === 140) hash['inNetworkFamilyOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[1]
          if (index === 141) hash['outOfNetworkIndividualOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[1]
          if (index === 142) hash['outOfNetworkFamilyOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[0]
        })
      }
    });
    return res.status(200).json({cost: hash})
  });
  pdfParser.loadPDF(path);
}

const sobUpload = (req, res, next) => {
  const pdfParser = new PDFParser()
  const file = req.file
  const path = file.path
  const name = file.fieldname
  const hash = {}
  let count = 0

  pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
  pdfParser.on("pdfParser_dataReady", pdfData => {
    pdfData.formImage['Pages'].map((page, index) => {
      if (index === 0) {
        page['Texts'].map((text, index) => {
          if (index === 40) hash['inNetworkIndividualDeductible'] = decodeURIComponent(text['R'][0]['T']).trim().split(' ')[0]
          if (index === 42) hash['inNetworkFamilyDeductible'] = decodeURIComponent(text['R'][0]['T']).trim().split(' ')[0]
          if (index === 43) hash['outOfNetworkIndividualDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[4]
          if (index === 45) hash['outOfNetworkFamilyDeductible'] = decodeURIComponent(text['R'][0]['T']).split(' ')[4]
        })
      }
      if (index === 2) {
        page['Texts'].map((text, index) => {
          if (index === 10) hash['inNetworkIndividualOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[3]
          if (index === 12) hash['inNetworkFamilyOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[5]
          if (index === 32) hash['outOfNetworkIndividualOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[3]
          if (index === 34) hash['outOfNetworkFamilyOutOfPocketLimit'] = decodeURIComponent(text['R'][0]['T']).split(' ')[5]
        })
      }
    });
    return res.status(200).json({cost: hash})
  });
  pdfParser.loadPDF(path);
}

app.get('/', (req, res) => {
  res.send('home')
})

app.post('/sbcUpload', uploader.single('sbc'), sbcUpload)
app.post('/sobUpload', uploader.single('sob'), sobUpload)


app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})