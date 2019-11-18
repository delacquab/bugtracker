
const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowToSheet = async () => {
    const doc = new GoogleSpreadsheet('1F-tlPdUqFq0dQ8xQm-VeyW_S-SwAhESphDLYbK5nHrc')
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('planilha aberta')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'Bruno', email: 'teste' })
}

addRowToSheet()

/*
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('Não foi possivel abrir a planilha')
    } else {
        console.log('planilha aberta')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Bruno', email: 'teste' }, err => {
                console.log('linha inserida')
            })

        })
    }
})
*/
