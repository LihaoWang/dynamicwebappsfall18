console.log ('hello server')
const express = require('express')
const app = express()
const server = app.listen(3000, listening)

function listening(){
    console.log('I am listening')
}

app.use(express.static('public'))

app.get('/hello',sayhello)

function sayhello(request, response){
    response.send('hello to you')
}

app.get('/hi/:database/:anothervar', sayhi)

function sayhi(request, response){
    var data = request.params;
    var word = ""
    for (i=0;i<data.anothervar;i++){
        word += 'Hi '+ data.database + '. How are you'
    }
    response.send(word)
}