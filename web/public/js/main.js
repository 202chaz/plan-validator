function parseFile(type) {
    const input = document.getElementById(type);
    const arr = input.files[0].name.split('.');
    const fileType = arr.pop()
    // Verifies the file is an excel file
    if (fileType === 'xlsm' || fileType === 'xls' || fileType === 'xlsx' || fileType === 'pdf') {
        if (type === 'pbt') parsePBT(input)
        if (type === 'sbc') parseSBC(input)
        if (type === 'sob') parseSOB(input)
    } else {
        return console.error('Please upload an excel file');
    }
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
        sessionStorage.setItem('table-data', JSON.stringify(data))
        let tableBody = document.getElementById('pbt-body');
        data.headers.benefitsPackage.map((benefit, index) => {
            let tr = document.createElement('tr');
            tr.setAttribute('index', index)
            tr.classList.add('benefit-row')
            let th = document.createElement('th')
            th.setAttribute('scope', 'row')
            th.innerText = `${benefit.name}`
            th.classList.add('benefit-heading')
            th.setAttribute('colspan', 2)
            th.setAttribute('index', index)
            tr.append(th)
            tableBody.append(tr)
        })

        let tableHeadings = document.querySelectorAll('.benefit-row')
        tableHeadings.forEach((heading) => {
            let tableData = data.tableData.benefitsPackage;
            tableData.map((data) => {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerText = `${data.key}`;
                let tdTwo = document.createElement('td');
                tdTwo.innerText = `${data.value}`;
                tr.appendChild(td)
                tr.appendChild(tdTwo)
                // Plan Identifiers
                if (data.index <= 5 && heading.getAttribute('index') == 0) {
                    heading.after(tr)
                }
                // Plan Attributes
                if (data.index >= 6 && data.index <= 22 && heading.getAttribute('index') == 1) {
                    heading.after(tr)
                }
                // Stand Alone Dental
                if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 2) {
                    heading.after(tr)
                }
                // Plan Dates
                if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 3) {
                    heading.after(tr)
                }
                // Geographic Coverage
                if (data.index >= 27 && data.index <= 31 && heading.getAttribute('index') == 4) {
                    heading.after(tr)
                }
            })

        })

        data.headers.costShare.map((cost, index) => {
            let tr = document.createElement('tr');
            tr.setAttribute('index', index)
            tr.classList.add('cost-row')
            let th = document.createElement('th')
            th.setAttribute('scope', 'row')
            th.innerText = `${cost.name}`
            th.classList.add('cost-heading')
            th.setAttribute('colspan', 2)
            th.setAttribute('index', index)
            tr.append(th)
            tableBody.append(tr)
        })

        let costHeadings = document.querySelectorAll('.cost-row')
        costHeadings.forEach((heading) => {
            let tableData = data.tableData.costShare;
            tableData.map((data) => {
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                td.innerText = `${data.key}`;
                let tdTwo = document.createElement('td');
                tdTwo.innerText = `${data.value}`;
                tr.appendChild(td)
                tr.appendChild(tdTwo)
                // Plan Cost Sharing Attributes
                if (data.index <= 10 && heading.getAttribute('index') == 0) {
                    heading.after(tr)
                }
                // Having A Baby
                if (data.index >= 11 && data.index <= 14 && heading.getAttribute('index') == 1) {
                    heading.after(tr)
                }
                // Having Diabetes
                if (data.index >= 15 && data.index <= 18 && heading.getAttribute('index') == 2) {
                    heading.after(tr)
                }
                // Treatment of a Simple Fracture
                if (data.index >= 19 && data.index <= 22 && heading.getAttribute('index') == 3) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 4) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 5) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 27 && data.index <= 28 && heading.getAttribute('index') == 6) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 29 && data.index <= 30 && heading.getAttribute('index') == 7) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 31 && data.index <= 32 && heading.getAttribute('index') == 8) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 33 && data.index <= 34 && heading.getAttribute('index') == 9) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 35 && data.index <= 36 && heading.getAttribute('index') == 10) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 37 && data.index <= 38 && heading.getAttribute('index') == 11) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 39 && data.index <= 40 && heading.getAttribute('index') == 12) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 41 && data.index <= 42 && heading.getAttribute('index') == 13) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 43 && data.index <= 44 && heading.getAttribute('index') == 14) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 45 && data.index <= 46 && heading.getAttribute('index') == 15) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 47 && data.index <= 49 && heading.getAttribute('index') == 16) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 50 && data.index <= 52 && heading.getAttribute('index') == 17) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 53 && data.index <= 54 && heading.getAttribute('index') == 18) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 55 && data.index <= 56 && heading.getAttribute('index') == 19) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 57 && data.index <= 59 && heading.getAttribute('index') == 20) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 60 && data.index <= 62 && heading.getAttribute('index') == 21) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 63 && data.index <= 64 && heading.getAttribute('index') == 22) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 65 && data.index <= 66 && heading.getAttribute('index') == 23) {
                    heading.after(tr)
                }
                // In Network
                if (data.index >= 67 && data.index <= 69 && heading.getAttribute('index') == 24) {
                    heading.after(tr)
                }
                // In Network (Tier 2)
                if (data.index >= 70 && data.index <= 72 && heading.getAttribute('index') == 25) {
                    heading.after(tr)
                }
                // Out of Network
                if (data.index >= 73 && data.index <= 74 && heading.getAttribute('index') == 26) {
                    heading.after(tr)
                }
                // Combined In/Out Network
                if (data.index >= 75 && data.index <= 76 && heading.getAttribute('index') == 27) {
                    heading.after(tr)
                }
                // No title
                if (data.index >= 77 && data.index <= 79 && heading.getAttribute('index') == 28) {
                    heading.after(tr)
                }
            })
            // 
        })
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
            // const data = res.data.cost
            let tableBuilder = sessionStorage.getItem('table-data')
            tableBuilder = JSON.parse(tableBuilder)
            let sbcTable = document.getElementById('sbc-body');

            tableBuilder.headers.benefitsPackage.map((benefit, index) => {
                let tr = document.createElement('tr');
                tr.setAttribute('index', index)
                tr.classList.add('sbc-benefit-row')
                let th = document.createElement('th')
                th.setAttribute('scope', 'row')
                th.innerText = `${benefit.name}`
                th.classList.add('sbc-benefit-heading')
                th.setAttribute('colspan', 2)
                th.setAttribute('index', index)
                tr.append(th)
                sbcTable.append(tr)
            })
    
            let tableHeadings = document.querySelectorAll('.sbc-benefit-row')
            tableHeadings.forEach((heading) => {
                let tableData = tableBuilder.tableData.benefitsPackage;
                tableData.map((data) => {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.innerText = `${data.key}`;
                    let tdTwo = document.createElement('td');
                    tdTwo.innerText = `${data.value}`;
                    tr.appendChild(td)
                    tr.appendChild(tdTwo)
                    // Plan Identifiers
                    if (data.index <= 5 && heading.getAttribute('index') == 0) {
                        heading.after(tr)
                    }
                    // Plan Attributes
                    if (data.index >= 6 && data.index <= 22 && heading.getAttribute('index') == 1) {
                        heading.after(tr)
                    }
                    // Stand Alone Dental
                    if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 2) {
                        heading.after(tr)
                    }
                    // Plan Dates
                    if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 3) {
                        heading.after(tr)
                    }
                    // Geographic Coverage
                    if (data.index >= 27 && data.index <= 31 && heading.getAttribute('index') == 4) {
                        heading.after(tr)
                    }
                })
    
            })
    
            tableBuilder.headers.costShare.map((cost, index) => {
                let tr = document.createElement('tr');
                tr.setAttribute('index', index)
                tr.classList.add('sbc-cost-row')
                let th = document.createElement('th')
                th.setAttribute('scope', 'row')
                th.innerText = `${cost.name}`
                th.classList.add('sbc-cost-heading')
                th.setAttribute('colspan', 2)
                th.setAttribute('index', index)
                tr.append(th)
                sbcTable.append(tr)
            })
    
            let costHeadings = document.querySelectorAll('.sbc-cost-row')
            costHeadings.forEach((heading) => {
                let tableData = tableBuilder.tableData.costShare;
                tableData.map((data) => {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.innerText = `${data.key}`;
                    let tdTwo = document.createElement('td');
                    tdTwo.innerText = `${data.value}`;
                    tr.appendChild(td)
                    tr.appendChild(tdTwo)
                    // Plan Cost Sharing Attributes
                    if (data.index <= 10 && heading.getAttribute('index') == 0) {
                        heading.after(tr)
                    }
                    // Having A Baby
                    if (data.index >= 11 && data.index <= 14 && heading.getAttribute('index') == 1) {
                        heading.after(tr)
                    }
                    // Having Diabetes
                    if (data.index >= 15 && data.index <= 18 && heading.getAttribute('index') == 2) {
                        heading.after(tr)
                    }
                    // Treatment of a Simple Fracture
                    if (data.index >= 19 && data.index <= 22 && heading.getAttribute('index') == 3) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 4) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 5) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 27 && data.index <= 28 && heading.getAttribute('index') == 6) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 29 && data.index <= 30 && heading.getAttribute('index') == 7) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 31 && data.index <= 32 && heading.getAttribute('index') == 8) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 33 && data.index <= 34 && heading.getAttribute('index') == 9) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 35 && data.index <= 36 && heading.getAttribute('index') == 10) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 37 && data.index <= 38 && heading.getAttribute('index') == 11) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 39 && data.index <= 40 && heading.getAttribute('index') == 12) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 41 && data.index <= 42 && heading.getAttribute('index') == 13) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 43 && data.index <= 44 && heading.getAttribute('index') == 14) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 45 && data.index <= 46 && heading.getAttribute('index') == 15) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 47 && data.index <= 49 && heading.getAttribute('index') == 16) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 50 && data.index <= 52 && heading.getAttribute('index') == 17) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 53 && data.index <= 54 && heading.getAttribute('index') == 18) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 55 && data.index <= 56 && heading.getAttribute('index') == 19) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 57 && data.index <= 59 && heading.getAttribute('index') == 20) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 60 && data.index <= 62 && heading.getAttribute('index') == 21) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 63 && data.index <= 64 && heading.getAttribute('index') == 22) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 65 && data.index <= 66 && heading.getAttribute('index') == 23) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 67 && data.index <= 69 && heading.getAttribute('index') == 24) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 70 && data.index <= 72 && heading.getAttribute('index') == 25) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 73 && data.index <= 74 && heading.getAttribute('index') == 26) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 75 && data.index <= 76 && heading.getAttribute('index') == 27) {
                        heading.after(tr)
                    }
                    // No title
                    if (data.index >= 77 && data.index <= 79 && heading.getAttribute('index') == 28) {
                        heading.after(tr)
                    }
                })
                // 
            })

            // Clears form input
            document.getElementById('sbc').value = '';
            // Checks tables data
            // compareTables()
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
            const data = res.data.cost
            let tableBuilder = sessionStorage.getItem('table-data')
            tableBuilder = JSON.parse(tableBuilder)

            let sobTable = document.getElementById('sob-body');

            tableBuilder.headers.benefitsPackage.map((benefit, index) => {
                let tr = document.createElement('tr');
                tr.setAttribute('index', index)
                tr.classList.add('sob-benefit-row')
                let th = document.createElement('th')
                th.setAttribute('scope', 'row')
                th.innerText = `${benefit.name}`
                th.classList.add('sob-benefit-heading')
                th.setAttribute('colspan', 2)
                th.setAttribute('index', index)
                tr.append(th)
                sobTable.append(tr)
            })
    
            let tableHeadings = document.querySelectorAll('.sob-benefit-row')
            tableHeadings.forEach((heading) => {
                let tableData = tableBuilder.tableData.benefitsPackage;
                tableData.map((data) => {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.innerText = `${data.key}`;
                    let tdTwo = document.createElement('td');
                    tdTwo.innerText = `${data.value}`;
                    tr.appendChild(td)
                    tr.appendChild(tdTwo)
                    // Plan Identifiers
                    if (data.index <= 5 && heading.getAttribute('index') == 0) {
                        heading.after(tr)
                    }
                    // Plan Attributes
                    if (data.index >= 6 && data.index <= 22 && heading.getAttribute('index') == 1) {
                        heading.after(tr)
                    }
                    // Stand Alone Dental
                    if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 2) {
                        heading.after(tr)
                    }
                    // Plan Dates
                    if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 3) {
                        heading.after(tr)
                    }
                    // Geographic Coverage
                    if (data.index >= 27 && data.index <= 31 && heading.getAttribute('index') == 4) {
                        heading.after(tr)
                    }
                })
    
            })
    
            tableBuilder.headers.costShare.map((cost, index) => {
                let tr = document.createElement('tr');
                tr.setAttribute('index', index)
                tr.classList.add('sob-cost-row')
                let th = document.createElement('th')
                th.setAttribute('scope', 'row')
                th.innerText = `${cost.name}`
                th.classList.add('sob-cost-heading')
                th.setAttribute('colspan', 2)
                th.setAttribute('index', index)
                tr.append(th)
                sobTable.append(tr)
            })
    
            let costHeadings = document.querySelectorAll('.sob-cost-row')
            costHeadings.forEach((heading) => {
                let tableData = tableBuilder.tableData.costShare;
                tableData.map((data) => {
                    let tr = document.createElement('tr');
                    let td = document.createElement('td');
                    td.innerText = `${data.key}`;
                    let tdTwo = document.createElement('td');
                    tdTwo.innerText = `${data.value}`;
                    tr.appendChild(td)
                    tr.appendChild(tdTwo)
                    // Plan Cost Sharing Attributes
                    if (data.index <= 10 && heading.getAttribute('index') == 0) {
                        heading.after(tr)
                    }
                    // Having A Baby
                    if (data.index >= 11 && data.index <= 14 && heading.getAttribute('index') == 1) {
                        heading.after(tr)
                    }
                    // Having Diabetes
                    if (data.index >= 15 && data.index <= 18 && heading.getAttribute('index') == 2) {
                        heading.after(tr)
                    }
                    // Treatment of a Simple Fracture
                    if (data.index >= 19 && data.index <= 22 && heading.getAttribute('index') == 3) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 23 && data.index <= 24 && heading.getAttribute('index') == 4) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 25 && data.index <= 26 && heading.getAttribute('index') == 5) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 27 && data.index <= 28 && heading.getAttribute('index') == 6) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 29 && data.index <= 30 && heading.getAttribute('index') == 7) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 31 && data.index <= 32 && heading.getAttribute('index') == 8) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 33 && data.index <= 34 && heading.getAttribute('index') == 9) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 35 && data.index <= 36 && heading.getAttribute('index') == 10) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 37 && data.index <= 38 && heading.getAttribute('index') == 11) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 39 && data.index <= 40 && heading.getAttribute('index') == 12) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 41 && data.index <= 42 && heading.getAttribute('index') == 13) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 43 && data.index <= 44 && heading.getAttribute('index') == 14) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 45 && data.index <= 46 && heading.getAttribute('index') == 15) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 47 && data.index <= 49 && heading.getAttribute('index') == 16) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 50 && data.index <= 52 && heading.getAttribute('index') == 17) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 53 && data.index <= 54 && heading.getAttribute('index') == 18) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 55 && data.index <= 56 && heading.getAttribute('index') == 19) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 57 && data.index <= 59 && heading.getAttribute('index') == 20) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 60 && data.index <= 62 && heading.getAttribute('index') == 21) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 63 && data.index <= 64 && heading.getAttribute('index') == 22) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 65 && data.index <= 66 && heading.getAttribute('index') == 23) {
                        heading.after(tr)
                    }
                    // In Network
                    if (data.index >= 67 && data.index <= 69 && heading.getAttribute('index') == 24) {
                        heading.after(tr)
                    }
                    // In Network (Tier 2)
                    if (data.index >= 70 && data.index <= 72 && heading.getAttribute('index') == 25) {
                        heading.after(tr)
                    }
                    // Out of Network
                    if (data.index >= 73 && data.index <= 74 && heading.getAttribute('index') == 26) {
                        heading.after(tr)
                    }
                    // Combined In/Out Network
                    if (data.index >= 75 && data.index <= 76 && heading.getAttribute('index') == 27) {
                        heading.after(tr)
                    }
                    // No title
                    if (data.index >= 77 && data.index <= 79 && heading.getAttribute('index') == 28) {
                        heading.after(tr)
                    }
                })
                // 
            })
 
            // Clears form input
            document.getElementById('sob').value = '';
            // Checks tables data
            // compareTables()
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