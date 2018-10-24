console.log ('hello server')
const express = require('express')
const app = express()
const server = app.listen(3000, listening)
function listening(){
    console.log('I am listening')
}

var fs = require('fs')
var data = fs.readFileSync('words.json')
var words = JSON.parse(data)


app.get('/add/:word/:score', addWord);

function addWord(request, response){
    var data = request.params; //score is a parameter
    var word = data.word;	
    var score = Number(data.score);
    words[word] = score;
    var data = JSON.stringify(words); 
    fs.writeFile('words.json', data, finished);
        function finished(err) {
            console.log('all set')
        } 
    var reply = {
        msg: "Thank you for your word."
    }
	response.send(reply)
}

app.get('/see', showWord)

function showWord(request,response){
    response.send(words)
}