function parseFile(type) {
    const input = document.getElementById(type);
    const fileType = input.files[0].name.split('.')[1];
    // Verifies the file is an excel file
    if (fileType === 'xlsm' || fileType === 'xls' || fileType === 'pdf') {
        if (type === 'pbt') parsePBT(input)
        if (type === 'sbc') parseSBC(input)
        if (type === 'sob') parseSOB(input)
    } else {
        return console.error('Please upload an excel file');
    }
}

function parsePBT(input) {
    const availableSheets = [];
    readXlsxFile(input.files[0], { getSheets: true }).then((sheets) => {
       let index = sheets.findIndex(s => s.name === "Benefits Package 1")
        // Get the rows for the sheet and builds the table rows
        let tableRows = [];

        readXlsxFile(input.files[0], { sheet: 2 }).then(function(rows, index) {
            // Get Benefit rows
            rows.map((row, index) => {
                if (index > 58 && index < 99) {
                    let tableBody = document.getElementById('pbt-body');
                    let title = row[0];
                    let inNetworkCovered = row[3];
                    let outNetworkCovered = row[10];
                    let tableRow = document.createElement('tr');
                    let tableData = document.createElement('td');
                    let tableDataTwo = document.createElement('td');
                    let tableDataThree = document.createElement('td');
                    tableData.innerHTML = title;
                    tableDataTwo.innerHTML = inNetworkCovered;
                    tableDataThree.innerHTML = outNetworkCovered
                    tableRow.append(tableData)
                    tableRow.append(tableDataTwo)
                    tableRow.append(tableDataThree)
                    tableBody.append(tableRow)
                }
            })            
        })
    })
}

function parseSBC(input) {
    const file = input.files[0];
    const dataForm = new FormData();
    dataForm.append('sbc', file)
    axios.post('/sbcUpload', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
        const data = res.data.cost
        // Build table with data
        let tableBody = document.getElementById('sbc-body');
        while (tableBody.hasChildNodes()) {
            tableBody.removeChild(tableBody.lastChild);
        }
        let tableRow = document.createElement('tr');
        let tableRowTwo = document.createElement('tr');
        let tableRowThree = document.createElement('tr');
        let tableRowFour = document.createElement('tr');
        let tableData = document.createElement('td');
        let tableDataTwo = document.createElement('td');
        let tableDataThree = document.createElement('td');
        let tableDataFour = document.createElement('td');
        let tableDataFive= document.createElement('td');
        let tableDataSix = document.createElement('td');
        let tableDataSeven = document.createElement('td');
        let tableDataEight = document.createElement('td');
        let tableDataNine = document.createElement('td');
        let tableDataTen = document.createElement('td');
        let tableDataEleven = document.createElement('td');
        let tableDataTwelve = document.createElement('td');
        tableData.innerHTML = 'Family Deductible'
        tableDataTwo.innerHTML = data.inNetworkFamilyDeductible
        tableDataThree.innerHTML = data.outOfNetworkFamilyDeductible
        tableDataFour.innerHTML = 'Individual Deductible'
        tableDataFive.innerHTML = data.inNetworkIndividualDeductible
        tableDataSix.innerHTML = data.outOfNetworkIndividualDeductible
        tableDataSeven.innerHTML = 'Family Out of Pocket'
        tableDataEight.innerHTML = data.inNetworkFamilyOutOfPocketLimit
        tableDataNine.innerHTML = data.outOfNetworkFamilyOutOfPocketLimit
        tableDataTen.innerHTML = 'Individual Out of Pocket'
        tableDataEleven.innerHTML = data.inNetworkIndividualOutOfPocketLimit
        tableDataTwelve.innerHTML = data.outOfNetworkIndividualOutOfPocketLimit
        tableRow.append(tableData)
        tableRow.append(tableDataTwo)
        tableRow.append(tableDataThree)
        tableRowTwo.append(tableDataFour)
        tableRowTwo.append(tableDataFive)
        tableRowTwo.append(tableDataSix)
        tableRowThree.append(tableDataSeven)
        tableRowThree.append(tableDataEight)
        tableRowThree.append(tableDataNine)
        tableRowFour.append(tableDataTen)
        tableRowFour.append(tableDataEleven)
        tableRowFour.append(tableDataTwelve)
        tableBody.append(tableRow)
        tableBody.append(tableRowTwo)
        tableBody.append(tableRowThree)
        tableBody.append(tableRowFour)
        // Clears form input
        document.getElementById('sbc').value = '';
        // Checks tables data
        compareTables()
    })
    .catch(err => console.log(err)); 
}

function parseSOB(input) {
    const file = input.files[0];
    const dataForm = new FormData();
    dataForm.append('sob', file)
    axios.post('/sobUpload', dataForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
        const data = res.data.cost
        // Build table with data
        let tableBody = document.getElementById('sob-body');
        while (tableBody.hasChildNodes()) {
            tableBody.removeChild(tableBody.lastChild);
        }
        let tableRow = document.createElement('tr');
        let tableRowTwo = document.createElement('tr');
        let tableRowThree = document.createElement('tr');
        let tableRowFour = document.createElement('tr');
        let tableData = document.createElement('td');
        let tableDataTwo = document.createElement('td');
        let tableDataThree = document.createElement('td');
        let tableDataFour = document.createElement('td');
        let tableDataFive= document.createElement('td');
        let tableDataSix = document.createElement('td');
        let tableDataSeven = document.createElement('td');
        let tableDataEight = document.createElement('td');
        let tableDataNine = document.createElement('td');
        let tableDataTen = document.createElement('td');
        let tableDataEleven = document.createElement('td');
        let tableDataTwelve = document.createElement('td');
        tableData.innerHTML = 'Family Deductible'
        tableDataTwo.innerHTML = data.inNetworkFamilyDeductible
        tableDataThree.innerHTML = data.outOfNetworkFamilyDeductible
        tableDataFour.innerHTML = 'Individual Deductible'
        tableDataFive.innerHTML = data.inNetworkIndividualDeductible
        tableDataSix.innerHTML = data.outOfNetworkIndividualDeductible
        tableDataSeven.innerHTML = 'Family Out of Pocket'
        tableDataEight.innerHTML = data.inNetworkFamilyOutOfPocketLimit
        tableDataNine.innerHTML = data.outOfNetworkFamilyOutOfPocketLimit
        tableDataTen.innerHTML = 'Individual Out of Pocket'
        tableDataEleven.innerHTML = data.inNetworkIndividualOutOfPocketLimit
        tableDataTwelve.innerHTML = data.outOfNetworkIndividualOutOfPocketLimit
        tableRow.append(tableData)
        tableRow.append(tableDataTwo)
        tableRow.append(tableDataThree)
        tableRowTwo.append(tableDataFour)
        tableRowTwo.append(tableDataFive)
        tableRowTwo.append(tableDataSix)
        tableRowThree.append(tableDataSeven)
        tableRowThree.append(tableDataEight)
        tableRowThree.append(tableDataNine)
        tableRowFour.append(tableDataTen)
        tableRowFour.append(tableDataEleven)
        tableRowFour.append(tableDataTwelve)
        tableBody.append(tableRow)
        tableBody.append(tableRowTwo)
        tableBody.append(tableRowThree)
        tableBody.append(tableRowFour)
        // Clears form input
        document.getElementById('sob').value = '';
        // Checks tables data
        compareTables()
    })
    .catch(err => console.log(err)); 
}

function compareTables() {
    let sob = document.getElementById('sob-body');
    let sbc = document.getElementById('sbc-body');
    if (sob.rows.length > 0 && sbc.rows.length) {
        console.log(sbc.rows)
    }
}

function submitForm(id) {
    const form = document.getElementById(id)
    // form.submit()
    console.log(form)
}

