const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())
const port = 3000
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
const multer  = require('multer')
const carriers = ['aetna', 'cigna', 'unitedhealth', 'anthem', 'carefirst', 'blue cross'] 
const xlsx = require('xlsx')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
      cb(null,  file.originalname );
  }
})
const uploader = multer({ storage: storage})

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
  const file = req.file
  const path = file.path
  getSBCContent(path, res)
}

const sobUpload = (req, res, next) => {
  const file = req.file
  const path = file.path
  getSOBContent(path, res)
}

const pbtUpload = (req, res, next) => {
  const file = req.file
  const path = file.path
  getPBTContent(path, res)
}

async function parsePdf(pages, carrier) {

}

async function getSBCContent(filename, res) {
  const doc = await pdfjs.getDocument(filename).promise // note the use of the property promise
  const pages = [1,2,3]
  let hash = {}

  pages.map(async (p) => {
    if (p == 1) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      let levelOfCoverage = () => {
        let types = ['Gold', 'Silver', 'Bronze', 'Platinum', 'Catastrophic']
        let name = filename.toLowerCase()
        return types.find(type => name.includes(type.toLowerCase()))
      }
      lines = [];
      line = '';
      planInfo = {}
      items.map((item, index) => {
        // Get Plan Names
        if (item.str.includes("UHC") && !planInfo['name']) planInfo['name'] = item.str
        if (item.str.includes("KP") && !planInfo['name']) planInfo['name'] = item.str
        if (item.str.includes("OAEPO") && !planInfo['name']) planInfo['name'] = item.str
        if (item.str.includes("BluePreferred") && !planInfo['name']) planInfo['name'] = item.str
        if (item.str.includes("BlueChoice") && !planInfo['name']) planInfo['name'] = item.str
        // Get Coverage Period
        if (item.str.includes("Coverage Period") && !planInfo['coveragePeriod']) planInfo['coveragePeriod'] = item.str.replace('Coverage Period:', '').trim()
        // Get the offering
        if (item.str.includes("Coverage for") && !planInfo['coverageFor']) planInfo['coverageFor'] = item.str.replace('Coverage for:', '').trim()
        // Get the Plan Type
        if (item.str.includes("Plan Type") && !planInfo['planType']) planInfo['planType'] = item.str.replace('Plan Type:', '').trim()
        let n = item.str.search("Coverage for:")
        if (n === 0) {
          console.log(item)
        }
      })
      // Get the level of coverage
      planInfo['levelOfCoverage'] = levelOfCoverage() 
    }
  })

  res.status(200).json({cost: {}})
 
}



async function getSOBContent(filename, res) {
  const doc = await pdfjs.getDocument(filename).promise // note the use of the property promise
  let pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  
  deductibleTableIndex = 0
  maximumOutOfPocketTableIndex = 0
  deductibleFamilyIndex = 0
  deductibleIndividualIndex = 0
  deductibleFamilyInNetworkIndex = 0
  outOfPocketIndividualIndex = 0
  outOfPocketFamilyIndex = 0
  let individualDeductibleCost = []
  let familyDeductibleCost = []
  let individualOutOfPocketCost = []
  let familyOutOfPocketCost = []
  hash = {}

  pages.map(async(p) => {
    if (p === 3) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      items.map((item, index) => {
        // Get the deductible table in PDF
        if (item.str.includes("You have to meet your")) deductibleTableIndex = index
        if (item.str.includes("pocket limit")) maximumOutOfPocketTableIndex = index
    
        // Get the values from deductible tab
        if (index >= deductibleTableIndex && index <= (deductibleTableIndex + 33)) {
          if (item.str.includes('Individual')) deductibleIndividualIndex = index
          if (item.str.includes('Family')) deductibleFamilyInNetworkIndex = index
    
          if (index >= deductibleIndividualIndex && index <= (deductibleIndividualIndex + 7)) {
            // console.log(item.str)
            if (item.str) individualDeductibleCost.push(item.str)
          }
    
          if (index >= deductibleFamilyInNetworkIndex && index <= (deductibleFamilyInNetworkIndex + 7)) {
            if (item.str) familyDeductibleCost.push(item.str)
          }
        }
    
        // Get Maximum out of pocket cost
        if (index >=  maximumOutOfPocketTableIndex && index <= ( maximumOutOfPocketTableIndex + 33)) {
          if (item.str.includes('Individual')) outOfPocketIndividualIndex = index
          if (item.str.includes('Family')) outOfPocketFamilyIndex = index
    
          if (index >= outOfPocketIndividualIndex && index <= (outOfPocketIndividualIndex + 6)) {
            if (item.str) individualOutOfPocketCost.push(item.str)
          }
    
          if (index >= outOfPocketFamilyIndex && index <= (outOfPocketFamilyIndex + 6)) {
            if (item.str) familyOutOfPocketCost.push(item.str)
          }
        }
    
      })
    
      if (individualDeductibleCost) hash['inNetworkIndividualDeductible'] = individualDeductibleCost.join('').split('Individual')[1].trim().split(' ')[0]
      if (familyDeductibleCost) hash['inNetworkFamilyDeductible'] = familyDeductibleCost.join('').split('Family')[1].trim().split(' ')[0]
      if (individualOutOfPocketCost) hash['inNetworkIndividualOutOfPocketLimit'] = individualOutOfPocketCost.join('').split('Individual')[1].trim().split(' ')[0]
      if (familyOutOfPocketCost) hash['inNetworkFamilyOutOfPocketLimit'] = familyOutOfPocketCost.join('').split('Family')[1].trim().split(' ')[0]
    } else if (p === 5) {

    } else if (p === 6) {
      const page = await doc.getPage(p)
      let data = await page.getTextContent()
      let items = data.items
      items.map((item, index) => {
        console.log(item)
        console.log(index)
        // Get the deductible table in PDF
        if (item.str.includes("You have to meet your")) deductibleTableIndex = index
        if (item.str.includes("pocket limit")) maximumOutOfPocketTableIndex = index
      })
    }
  })
  setTimeout(() => {
    return res.status(200).json({cost: hash})
  }, 1000)
}

async function getPBTContent(filename, res) {
  let workbook = xlsx.readFile(filename);
  let benefitWs = workbook.Sheets['Benefits Package 1']
  let costWs = workbook.Sheets['Cost Share Variances 1']
  let bpHeadings = []
  let bpTData = []
  let csHeadings = []
  let csTData = []

  const bpHeaders = new Promise((res, reject) => {
    benefitWs['!ref'] = "A6:AF6"
    res(xlsx.utils.sheet_to_json(benefitWs, {header: 1, defval: ''}))
  })

  const bpData = new Promise((res, reject) => {
    benefitWs['!ref'] = "A7:AF8"
    res(xlsx.utils.sheet_to_json(benefitWs, {header: 0, defval: ''}))
  })

  const csHeaders = new Promise((res, reject) => {
    costWs['!ref'] = "A2:AAC2"
    res(xlsx.utils.sheet_to_json(costWs, {header: 1, defval: ''}))
  })

  const csData = new Promise((res, reject) => {
    costWs['!ref'] = "A3:AAC4"
    res(xlsx.utils.sheet_to_json(costWs, {header: 0, defval: ''}))
  })

  await bpHeaders.then(res => {
    res[0].map((key, index) => {
      if (key !== '') bpHeadings.push({name: key, index, heading: true})
    })
  })

  await csHeaders.then(res => {
    res[0].map((key, index) => {
      if (key !== '') csHeadings.push({name: key, index, heading: true})
    })
  })

  await bpData.then(res => {
    const entries = Object.entries(res[0])
    entries.map((entry, index) => {
      bpTData.push({key: entry[0].split('_')[0], value: entry[1], index, heading: false})
    })
  })

  await csData.then(res => {
    const entries = Object.entries(res[0])
    entries.map((entry, index) => {
      csTData.push({key: entry[0].split('_')[0], value: entry[1], index, heading: false})
    })
  })

  return res.status(200).json({headers: { benefitsPackage: bpHeadings, costShare: csHeadings}, tableData: { benefitsPackage: bpTData.reverse(), costShare: csTData.reverse() }})

}

app.get('/', (req, res) => {
  res.send('home')
})

app.post('/sbcUpload', uploader.single('sbc'), sbcUpload)
app.post('/sobUpload', uploader.single('sob'), sobUpload)
app.post('/pbtUpload', uploader.single('pbt'), pbtUpload)

app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})