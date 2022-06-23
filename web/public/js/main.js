let selectOptions;
let pbtFilename;

function parseFile(type) {
    const input = document.getElementById(type);
    const arr = input.files[0].name.split('.');
    const fileType = arr.pop()
    // Verifies the file is an excel file
    if (fileType === 'xlsm' || fileType === 'xls' || fileType === 'xlsx' || fileType === 'pdf') {
        if (type === 'pbt' && fileType === 'xlsx' || fileType === 'xlsm' || fileType === 'xls') parsePBT(input)
        if (type === 'sbc') parseSBC(input)
        if (type === 'sob') parseSOB(input)
    } else {
        return console.error('Please upload an excel file');
    }
}

function getPlanInformation(hiosId) {
  let select = document.getElementById("plan-select");
  let value = select.value
  let selectedOption = selectOptions.find(option => option.key === value)
  getCostShareForPlan(selectedOption, pbtFilename)
}

function clearTableData() {
	let titleRows = document.querySelectorAll('.title-row');
	titleRows.forEach(row => row.remove())
	let mainRows = document.querySelectorAll('.main-row');
	mainRows.forEach(row => row.remove())
	let subRows = document.querySelectorAll('.sub-row');
	subRows.forEach(row => row.remove())
	let hrRows = document.querySelectorAll('.hr-row');
	hrRows.forEach(row => row.remove())
}

function getCostShareForPlan(option, filename) {
  axios.get(`/costvariances/${option.key}/${option.name}/${option.sheet}/${filename}`)
    .then(res => {
      let pbtHeaderOptions = sessionStorage.getItem('pbt-options');
      pbtHeaderOptions = JSON.parse(pbtHeaderOptions)
      let planData = res.data.data;
      let titles = pbtHeaderOptions.tableTitlesRow[0];
      let headings = pbtHeaderOptions.tableHeadingRow[0];
			let subHeadings = pbtHeaderOptions.tableSubHeadingRow[0];

      document.getElementById('pbt-hios').innerHTML = `HIOS: ${planData[0]}`;
      document.getElementById('pbt-metal-level').innerHTML = `Metal Level: ${planData[2]}`;
			clearTableData()
			
      let tableBody = document.getElementById('pbt-body');
      titles.map((title, index) => {
        if (index > 0 && title !== '' && !title.includes('SBC Scenario')) {
          let tr = document.createElement('tr')
					let hr = document.createElement('hr')
					hr.classList.add('hr-row')
          tr.setAttribute('index', index)
          tr.classList.add('title-row')
          let th = document.createElement('th')
          th.setAttribute('scope', 'row')
          th.innerText = `${title}`
          th.classList.add('title-heading')
          th.setAttribute('colspan', 2)
          th.setAttribute('index', index)
					hr.setAttribute('index', index)
          tr.append(th)
          tableBody.append(tr)
					tableBody.append(hr)
        }
      })

      let tableTitles = document.querySelectorAll('.hr-row')
      tableTitles.forEach((title, acc) => {
        let index = title.getAttribute('index')
        let upToIndex = tableTitles[acc + 1] ? tableTitles[acc + 1].getAttribute('index') : '';
        headings.map((heading, i) => {
          if (i <= 22) return
          if (heading !== '' && i >= index && i < upToIndex) {
            let tr = document.createElement('tr');
						let hr = document.createElement('hr');
						hr.classList.add('hr-main-row')
            tr.setAttribute('data-index', i)
            tr.classList.add('main-row')
            let th = document.createElement('th')
            th.setAttribute('scope', 'row')
            th.innerText = `${heading}`
            th.classList.add('main-heading')
            th.setAttribute('colspan', 2)
            th.setAttribute('index', i)
            let r = tr.append(th)
            title.before(tr)
          }
        })
      })

			let tableSubTitles = document.querySelectorAll('.main-row')
			tableSubTitles.forEach((title, acc) => {
				let index = title.getAttribute('data-index');
				let nextIndex = tableSubTitles[acc + 1] ? tableSubTitles[acc + 1].getAttribute('data-index') : '';
				subHeadings.map((heading, i) => {
					if (i <= 22) return;
					if (i >= index && i < nextIndex) {
						let tr = document.createElement('tr');
						tr.setAttribute('index', i)
						tr.classList.add('sub-row')
						let tdOne = document.createElement('td')
						let tdTwo = document.createElement('td')
						tdTwo.classList.add('data-value')
						tdOne.innerText = `${heading}`
						tdTwo.innerText = `${planData[i]}`
						tr.append(tdOne)
						tr.append(tdTwo)
						title.after(tr)
					}					
				})
			})
    })
}

async function parsePBT(input) {
    const file = input.files[0];
    const dataForm = new FormData();
    dataForm.append('pbt', file)
    axios.post('/pbtUpload', dataForm, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
        let data = res.data;
        sessionStorage.setItem('pbt-options', JSON.stringify(data))
        selectOptions = data.selectOptions;
        pbtFilename = data.filename.split('/')[1];
        if (selectOptions.length >=1 ) {
          let select = document.getElementById("plan-select");
					// Clear existing select options
					Array.from(select.options).forEach((option, index) => {
						if (index > 0) option.remove()
					})
          select.classList.remove('d-none')
          selectOptions.map((o) => {
            let option = document.createElement("option");
            option.text = o.name;
            option.value = o.key;
            select.appendChild(option);
          })
        }
      // Enable SOB and SBC input fields
      document.getElementById('sob').removeAttribute('disabled');
      document.getElementById('sbc').removeAttribute('disabled');
    })
}

function parseSBC(input) {
    const file = input.files[0];
    const dataForm = new FormData();
    dataForm.append('sbc', file)
    axios.post('/sbcUpload', dataForm, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            const data = res.data
            console.log(data)
						let table = document.getElementById('pbt-body');
						let copy = table.cloneNode(true);
            copy.id = 'sbc-body';
						let fields = copy.querySelectorAll('.data-value');
						fields.forEach(field => field.innerText = '')
            let sbcTable = document.getElementById('sbc-table').appendChild(copy);
            let ml = document.getElementById('sbc-metal-level');
            let hios = document.getElementById('sbc-hios');
            ml.innerHTML = `Metal Level: ${data.levelOfCoverage}`;
            hios.innerHTML = `HIOS: N/A`;
            let select = document.getElementById('sbc-select');
            select.options[0].text = `${data.name}`;
            select.classList.remove('d-none')
        })
        .catch(err => console.log(err));
}

function parseSOB(input) {
    const file = input.files[0];
    const dataForm = new FormData();
    dataForm.append('sob', file)
    axios.post('/sobUpload', dataForm, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
          console.log('Making Request');
          console.log(res);
          let data = res.data;
					let table = document.getElementById('pbt-body');
					let copy = table.cloneNode(true);
					let fields = copy.querySelectorAll('.data-value');
					fields.forEach(field => {
            let tr = field.closest('tr');
            let index = tr.getAttribute('index')
            console.log(tr)
            console.log(field)
            console.log('Index ', index);

            if (index == 39) field.innerText = data['Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)']['deductible']['individual'][0];
            if (index == 40) field.innerText = data['Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)']['deductible']['family'][0];
            if (index == 43) field.innerText = data['Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)']['deductible']['individual'][1];
            if (index == 44) field.innerText = data['Maximum Out of Pocket for Medical and Drug EHB Benefits (Total)']['deductible']['family'][1];
            if (index == 53) field.innerText = data['Medical EHB Deductible']['deductible']['individual'][0];
            if (index == 54) field.innerText = data['Medical EHB Deductible']['deductible']['family'][0];
            if (index == 111) field.innerText = data['Primary Care Visit to Treat an Injury or Illness']['physicianOffice']['pcp'];
            if (index == 116) field.innerText = data['Primary Care Visit to Treat an Injury or Illness']['physicianOffice']['percentages'][0];
            if (index == 117) field.innerText = data['Primary Care Visit to Treat an Injury or Illness']['physicianOffice']['specialist'];
            if (index == 122) field.innerText = data['Primary Care Visit to Treat an Injury or Illness']['physicianOffice']['percentages'][0];
            
            // field.innerText = ''
          })
					let sbcTable = document.getElementById('sob-table').appendChild(copy);
          //Updates
          document.getElementById("sob-option").innerHTML = data.plan;
          document.getElementById('sob-select').classList.remove('d-none');
          document.getElementById('sob-hios').innerHTML = `HIOS: N/A`;
          document.getElementById('sob-metal-level').innerHTML = `Metal Level: ${data.metalLevel}`

        })
        .catch(err => console.log(err));
}

function compareTables() {
    let sob = document.getElementById('sob-body');
    let sbc = document.getElementById('sbc-body');
    const sobrows = sob.querySelectorAll('tr')
    const sbcrows = sbc.querySelectorAll('tr')
    if (sobrows.length > 0 && sbcrows.length > 0) {
        Array.from(sobrows).forEach((sobrow, index) => {
            let sbcrow = sbcrows[index]
            let sobrowval = sobrow.querySelectorAll('td')[1].innerHTML
            let sbcrowval = sbcrow.querySelectorAll('td')[1].innerHTML
            if (sobrowval !== sbcrowval) {
                sobrow.classList.add('table-danger')
                sbcrow.classList.add('table-danger')
            } else {
                sobrow.classList.remove('table-danger')
                sbcrow.classList.remove('table-danger')
            }
        })
    }
}

function submitForm(id) {
    const form = document.getElementById(id)
    // form.submit()
    console.log(form)
}