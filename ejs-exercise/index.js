var express = require('express')
var app = express()
var ejs = require('ejs')

app.set('view engine', 'ejs')

// app.get('/date', function(request,response){
//     response.render('index')
// })

// app.get('/name', function(request,response){
//     response.render('index',{name:'Leo'})
// })

app.get('/', function (request, response) {
    response.render('index', {groceryitems: data.groceries})
})

var data = {
    groceries: [{
        store: 'Acme',
        list: [
            'strawberries',
            'blueberries',
            'yogurt'
        ]
    }, {
        store: 'Corner Market',
        list: [
            'baguette',
            'basil',
            'tomatoes'
        ]
    }]
};


app.listen(3000, function () {
    console.log('app is running')
})