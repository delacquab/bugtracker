const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

// configuracoes
const docId = '1F-tlPdUqFq0dQ8xQm-VeyW_S-SwAhESphDLYbK5nHrc'
const worksheetIndex = 0
sendGridKey = 'key do sendgrid'

app.use(bodyParser.urlencoded({ extended: true })) //vai ser chamado sempre

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.get('/', (request, response) => {
    response.render('home')
})

app.post('/', async (request, response) => {
    try {
        const doc = new GoogleSpreadsheet(docId)
        await promisify(doc.useServiceAccountAuth)(credentials)
        const info = await promisify(doc.getInfo)()
        const worksheet = info.worksheets[worksheetIndex]
        await promisify(worksheet.addRow)({
            name: request.body.name,
            email: request.body.email,
            issueType: request.body.issueType,
            howToReproduce: request.body.howToReproduce,
            expectedOutput: request.body.expectedOutput,
            receivedOutput: request.body.receivedOutput,
            userAgent: request.body.userAgent,
            userDate: request.body.userDate,
            source: request.query.source || 'direct'
        })

        if (request.body.issueType === 'CRITICAL') {
            sgMail.setApiKey(sendGridKey);
            const msg = {
                to: 'brunodelacqua@gmail.com',
                from: 'BugTracker@BugTracker.com',
                subject: 'BUG Crítico reportado',
                text: `
                    O usuário ${request.body.name} reportou um problema.
                `,
                html: `
                O usuário ${request.body.name} reportou um problema.
            `,
            };
            await sgMail.send(msg);
        }

        response.render('sucesso')
    } catch (err) {
        response.send('Erro ao enviar formulário.')
        console.log(err)
    }
})


app.listen(3000, (err) => {
    if (err) {
        console.log('Aconteceu um erro: ', err)
    } else {
        console.log('BugTracker rodando na porta http://localhost:3000')
    }
})
