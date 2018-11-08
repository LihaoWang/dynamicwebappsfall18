var express = require('express')
var app = express()
var ejs = require('ejs')
var request = require('request')
var bodyParser = require('body-parser')
const keys = require('./keys.js')

const apiKey = keys.giphy

var fs =require('fs')
var data = fs.readFileSync('user.json')
var user = JSON.parse(data)

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {gifUrl: null, error: null});
})

app.post('/', function (req, res) {
  let search = req.body.search;
  let url = `http://api.giphy.com/v1/gifs/search?q=${search}&api_key=${apiKey}`

  request(url, function (err, response, body) {
    if(err){
      res.render('index', {gifUrl: null, error: 'Error, please try again'});
    } else {
      let pic = JSON.parse(body)
      var num = Math.floor((Math.random() * 24) + 0)
      if(pic.data[num] == undefined){
        res.render('index', {gifUrl: null, error: 'Error, please try again'});
      } else {
        let picUrl = pic.data[num].images.original.url;
        console.log(picUrl);
        res.render('index', {gifUrl: picUrl, error: null});
      }
    }
  });
})

app.get('/signup',function(req,res){
    res.render('signup', {msg: null, error: null});
})

app.post('/signup',function(req,res){
    var name = req.body.name
    var password = req.body.password
    user[name]=password
    var userdata = JSON.stringify(user)
    fs.writeFile('user.json',userdata,finished)
    if(password != undefined){
        res.render('signup', {msg: 'Sign up successfully!', error: null});
    }
})

function finished(err) {
    console.log('all set')
    
} 

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})