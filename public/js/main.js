function parseFile(type) {
    const input = document.getElementById(type);
    const fileType = input.files[0].name.split('.')[1];
    // Verifies the file is an excel file
    if (fileType === 'xlsm' || fileType === 'xls') {
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
    const availableSheets = [];
}

function parseSOB(input) {
    const availableSheets = [];
}