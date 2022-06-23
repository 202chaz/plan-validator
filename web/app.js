const express = require('express')
const app = express()
app.use(express.static('public'))
app.use(express.json())
const port = 3000
const pdfjs = require("pdfjs-dist/legacy/build/pdf.js");
const multer  = require('multer')
const carriers = ['aetna', 'cigna', 'unitedhealth', 'anthem', 'carefirst', 'blue cross'] 
const xlsx = require('xlsx')
let planInfo = {};

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

function pdfToText(url, separator = ' ') {
  let pdf = pdfjs.getDocument(url);
  return pdf.promise.then(function(pdf) { // get all pages text
      let maxPages = pdf._pdfInfo.numPages;
      let countPromises = []; // collecting all page promises
      for (let i = 1; i <= maxPages; i++) {
          let page = pdf.getPage(i);
          countPromises.push(page.then(function(page) { // add page promise
              let textContent = page.getTextContent();
              return textContent.then(function(text) { // return content promise
                  return text.items.map(function(obj) {
                      return obj.str;
                  }).join(separator); // value page text
              });
          }));
      };
      // wait for all pages and join text
      return Promise.all(countPromises).then(function(texts) {
          for(let i = 0; i < texts.length; i++){
              texts[i] = texts[i].replace(/\s+/g, ' ').trim();
          };
          return texts;
      });
  });
};

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
          // console.log(item)
        }
      })
      // Get the level of coverage
      planInfo['levelOfCoverage'] = levelOfCoverage() 
    }
  })
  
  setTimeout(() => {
    res.status(200).json(planInfo)
  }, 2000)
}



async function getSOBContent(filename, res) {
  hash = {}
  pdfToText(filename).then(function(pdfTexts) {
    let arr = pdfTexts.map((page) => {
      // Deductibles
      if (page.includes('DEDUCTIBLES IN - NETWORK DEDUCTIBLE OUT - OF - NETWORK DEDUCTIBLE')) {
        let ehbData = page.split('.');
        let hasInNetworkDeductible;
        let ebhIndiv = [];
        let ehbFam = [];
        ehbData.map((data, index) => {
          if (data.includes('DEDUCTIBLES IN - NETWORK DEDUCTIBLE OUT - OF - NETWORK DEDUCTIBLE')) {
            hasInNetworkDeductible = !ehbData[index].includes('no In - Network Deductible')
          }
        })

        if (hasInNetworkDeductible) {
          ehbData.map(d => {
            if (d.includes('Individual Deductible is')) {
              let ded = d.split('$');
              ebhIndiv.push(ded[1])
            }
            if (d.includes('Family Deductible')) {
              let ded = d.split('$');
              ehbFam.push(ded[1])
            }
          })
        }

        if (!hasInNetworkDeductible) {
          ehbData.map(d => {
            if (d.includes('Individual Deductible')) {
              let ded = d.split('$');
              ebhIndiv.push(ded[1])
            }
            if (d.includes('Family Deductible')) {
              let ded = d.split('$');
              ehbFam.push(ded[1])
            }
          })
        }

        values = {
          deductible: {
            individual: ebhIndiv,
            family: ehbFam
          }
        }

        let plan = page.split('[')[2].split(']')[0];
        hash['plan'] = plan;
        let metalLevel;
        if (plan.includes('Platinum')) {
          metalLevel = 'Platinum'
        } else if (plan.includes('Gold')) {
          metalLevel = 'Gold'
        } else if (plan.includes('Silver')) {
          metalLevel = 'Silver'
        } else if (plan.includes('Bronze')) {
          metalLevel = 'Bronze'
        }
        hash['metalLevel'] = metalLevel;

        hash['Medical EHB Deductible'] = values;
      }
      // EO Deductibe

      // OUT-OF-POCKET MAXIMUM
      if (page.includes('OUT - OF - POCKET MAXIMUM IN - NETWORK OUT - OF - POCKET MAXIMUM OUT - OF - NETWORK OUT - OF - POCKET MAXIMUM')) {
        let oopMax = page.split('.');
        let hasInNetworkDeductible;
        let oopIndiv = [];
        let oopFam = [];
        oopMax.map((data, index) => {
          if (data.includes('OUT - OF - POCKET MAXIMUM IN - NETWORK OUT - OF - POCKET MAXIMUM OUT - OF - NETWORK OUT - OF - POCKET MAXIMUM')) {
            hasInNetworkDeductible = !oopMax[index].includes('no In - Network Deductible')
          }
        })

        if (hasInNetworkDeductible) {
          oopMax.map(d => {
            let data = d.split('$');
            if (d.includes('The Individual Out - of - Pocket Maximum is ')) {
              oopIndiv.push(data[1])
            }
            if (d.includes(' The Family Out - of - Pocket Maximum is') || d.includes(' The F amily Out - of - Pocket Maximum is ')) {
              oopFam.push(data[1])
            }
            
          })
        }

        if (!hasInNetworkDeductible) {
          oopMax.map(d => {
            if (d.includes('Individual Out-of-Pocket Maximum is')) {
              let ded = d.split('$');
              ebhIndiv.push(ded[1])
            }
            if (d.includes('Family Out-of-Pocket Maximum is')) {
              let ded = d.split('$');
              ehbFam.push(ded[1])
            }
          })
        }
        values = {
          deductible: {
            individual: oopIndiv,
            family: oopFam
          }
        }
        hash['Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)'] = values;
      }
      // END OUT-OF-POCKET MAXIMUM

      // OUTPATIENT FACILITY, OFFICE AND PROFESSIONAL SERVICES
      if (page.includes('OUTPATIENT FACILITY, OFFICE AND PROFESSIONAL SERVICES')) {
        let data = page.split('.').pop();
        let words = data.split(' ');
        let percentages = words.filter(word => word.includes('%'));
        let prices = words.filter(word => word.includes('$'));
        let details = {};
        details['physicianOffice'] = {
          pcp: prices[0],
          specialist: prices[1],
          clinicVisit: prices[2],
          percentages: [percentages[0]]
        }
        details['outPatientNonSurgical'] = {
          pcp: prices[3],
          specialist: prices[4],
          clinicVisit: prices[5],
          percentages: [percentages[0]]
        }

        hash['Primary Care Visit to Treat an Injury or Illness'] = details;
        hash['Specialist Visit'] = details;
        hash['Other Practitioner Office Visit (Nurse, Physician Assistant)'] = details;
        hash['Outpatient Facility Fee (e.g., Ambulatory Surgery Center)'] = details;      
      }
      // Laboratory Tests, X-Ray/Radiology Services, Specialty Imaging and Diagnostic Procedures
      if (page.includes('Non - Preventive Laboratory Tests')) {
        let data = page.split('.');
        let length = data.length - 1;
        let types = ['Non-Preventive Laboratory Tests (independent non-hospital laboratory)', 'Non-Preventive Laboratory Tests (outpatient department of a hospital)', 'Non-Preventive X-Ray/Radiology Services (independent non-hospital facility)',
        'Non-Preventive X-Ray/Radiology Services (outpatient department of a hospital)', 'Non-Preventive Specialty Imaging (independent non-hospital facility)', 'Non-Preventive Specialty Imaging (outpatient department of a hospital)',
        'Non-Preventive Diagnostic Testing except as otherwise specified (in an independent non-hospital facility)'];
        
        data.map((word, index) => {
         word = word.split('  ');
         if (index == length) {
          // Try to parse
          let phrase = word[0].replace(/\s/g, '');
          phrase.split('$').map((word, index) => {
            if (word.includes('pervisit')) {
              let price = word.split('pervisit')[0];
              let percentages = word.split('pervisit')[1].split('%')[0];
              let networkType = word.includes('In-NetworkandOut-of-Network') ? 'In-Network and Out-of-Network' : 'Out-of-Network';
              let values = {}
              values['key'] = types[index -1];
              values['price'] = price;
              values['percentages'] = percentages;
              values['networkType'] = networkType;
  
              hash[types[index -1]] = values;
            }
          })
         }
        })
      }
      // END of Laboratory Tests, X-Ray/Radiology Services, Specialty Imaging and Diagnostic Procedures

      // Preventative care
      if (page.includes('Sleep Studies')) {
        let data = page.split('.');
        let length = data.length - 1;
        let types = ['Non-Preventive Diagnostic Testing except as otherwise specified (in an outpatient department of a hospital)', 'Sleep Studies (Member’s home)',
        'Sleep Studies (office or freestanding facility)', 'Sleep Studies (outpatient department of a hospital)'];

        data.map((word, index) => {
          let phrase = word.replace(/\s/g, '');
          phrase.split('$').map(word => {
            if (word.includes('per')) {
              let price = word.split('per')[0];
              let percentages = word.split('per')[1].split('%')[0].replaceAll('visit', '').replaceAll('study', '');
              let networkType = word.includes('In-NetworkandOut-of-Network') ? 'In-Network and Out-of-Network' : 'Out-of-Network';
            }
          })
        });

        let screenTypes = ['Prostate Cancer Screening', 'Colorectal Cancer Screening', 'Pap Smear',
        'Breast Cancer Screening', 'Human Papillomavirus Screening Test', 'Preventive Laboratory Tests', 'Preventive X-Ray/Radiology Services'];

        let options = [];
        let services = [];
        let keys = screenTypes.map((type) => type.replace(/\s/g, ''));

        data.map((word, index) => {
          let data = page.split('.');
          let length = data.length - 1;
          let phrase = word.replace(/\s/g, '');
          phrase.split('$').map(word => {
            if (word.includes('Copaymentor')) {
              services.push(word)
            }
          })
        })
        // Removes paragraph text
        services = services.splice(1)
      }
      // Preventative care 
    })
    return res.status(200).json(hash)
  })
}

async function getPBTContent(filename, res) {
  let workbook = xlsx.readFile(filename);
  let sheets = workbook.SheetNames;
  let costShareSheets = sheets.filter((sheet) => sheet.includes('Cost Share'))
  let workSheets = [];
  let selectOptions = []
  let headingTableRows = workbook.Sheets[costShareSheets[0]];
  let tableHeadingRow;
  let tableSubHeadingRow;
  let tableTitlesRow;
  let data;

  costShareSheets.map((costSheet, index) => {
    workSheets[costSheet] = [];
    let currentSheet = workbook.Sheets[costSheet];
    let data = xlsx.utils.sheet_to_json(currentSheet, {header: 1, defval: ''})

    data.map((d, index) => {
      if (d[0] && d[0].split('-')[1] && d[0].split('-')[1].includes(01)) {
        workSheets[costSheet].push(d)
        selectOptions.push({key: d[0], name: d[1], sheet: costSheet})
      }
    })
  })
  // Builds titles for tables
  let titles = new Promise((res, reject) => {
    headingTableRows['!ref'] = "A1:AAC1"
    res(xlsx.utils.sheet_to_json(headingTableRows, {header: 1, defval: ''}))
  })
  // Builds headings for table
  let headings = new Promise((res, reject) => {
    headingTableRows['!ref'] = "A2:AAC2"
    res(xlsx.utils.sheet_to_json(headingTableRows, {header: 1, defval: ''}))
  })
  // Builds subheadings for table
  let subHeadings = new Promise((res, reject) => {
    headingTableRows['!ref'] = "A3:AAC3"
    res(xlsx.utils.sheet_to_json(headingTableRows, {header: 1, defval: ''}))
  })
 
  Promise.all([titles, headings, subHeadings])
    .then((values, index) => {
      tableTitlesRow = values[0]
      tableHeadingRow = values[1];
      tableSubHeadingRow = values[2];
    })
    .then(() => {
      data = {
        selectOptions,
        tableTitlesRow,
        tableHeadingRow,
        tableSubHeadingRow,
        filename
      }
    })
    .then(() => {
      return res.status(200).json(data)
    })
}

app.get('/', (req, res) => {
  res.send('home')
})

app.get('/costvariances/:key/:name/:sheet/:filename', (req, res) => {
  let workbook = xlsx.readFile(`uploads/${req.params.filename}`);
  let sheet = workbook.Sheets[req.params.sheet];
  let data = xlsx.utils.sheet_to_json(sheet, {header: 1, defval: ''})

  let tableData = data.find(d => d[0] === req.params.key)
  return res.status(200).json({data: tableData})
})

app.post('/sbcUpload', uploader.single('sbc'), sbcUpload)
app.post('/sobUpload', uploader.single('sob'), sobUpload)
app.post('/pbtUpload', uploader.single('pbt'), pbtUpload)

app.listen(port, () => {
  console.log(`App listening on port:${port}`)
})