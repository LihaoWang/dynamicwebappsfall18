var express = require('express')
var app = express()
var ejs = require('ejs')
var request = require('request')
var bodyParser = require('body-parser')
const keys = require('./keys.js')

const apiKey = keys.giphy
console.log(apiKey)

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})