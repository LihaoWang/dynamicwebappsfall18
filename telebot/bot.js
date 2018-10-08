//set up telebot api
const TeleBot = require('telebot');
const keys = require('./keys.js');
const weatherKey = keys.weather;
const telekey = keys.telegram;


//handle promises using a third-party module
const promise = require('make-promises-safe')

//set up weather api
var weather = require('openweather-apis');

//set up telebot
const bot = new TeleBot(telekey);

//set up weather data
weather.setLang('en')
weather.setCity('New York')
weather.setUnits('metric')
weather.setAPPID(weatherKey)

//set up twitter api
var Twit = require('twit')
var config = require('./twitconfig')
var T = new Twit(config)

//set up random quote npm
const randomQuote = require('forismatic-node')();

//set up rss service
// let RssFeedEmitter = require('rss-feed-emitter');
// let feeder = new RssFeedEmitter();

//set up fetch
const fetch = require('node-fetch')

//set up google news
const googleNews = keys.google;

//set up Giphy api
const giphy = keys.giphy
const trending = keys.trendingGif

// feeder.add({
//     url: 'http://www.nintendolife.com/feeds/news',
//     refresh: 2000
//   });
//   console.log(feeder.list())

bot.on('text', (msg) => msg.reply.text('Received'));

bot.on('/quote', (msg) => {
    getQuote(msg);
});
bot.on('sticker', (msg) => {
    fetch(trending)
    .then ((resp)=>resp.json())
    .then (function(data){
        var pic = data.data[Math.floor(Math.random() * 20)].images.original.url
        // console.log(pic)
        return bot.sendSticker(msg.from.id, pic);
    })
});
bot.on(['/start', '/hello'], (msg) => {
    return bot.sendMessage(msg.from.id, `Hello there! I'm your personal assistant. 
/weather to see today's weather
/news to see today's headline in Google News
/twitter <content> to post a status on twitter
/gif to get a funny cat sticker on Giphy
Also, send me a sticker, and I will reply you with another sticker`);
});

bot.on('/weather', (msg) => {
    getWeather(msg);
    weatherDesc(msg);
});

bot.on('/news', (msg) => {
    getNews(msg);
});

bot.on(/^\/twitter (.+)$/, (msg, props) => {
    const text = props.match[1];
    T.post('statuses/update', { status: text }, function(err, data, response) {
        // console.log(data)
      })
    return bot.sendMessage(msg.from.id, 'Twitter Posted!', { replyToMessage: msg.message_id });
});

bot.on('/gif',(msg)=>{
    getGif(msg);
})

function getQuote(message){
    randomQuote.getQuote(function (err, quote) {

            console.log(quote.quoteText);
            return bot.sendMessage(message.from.id, quote.quoteText)
        } 
    );

}

function getWeather(message) {
    weather.getTemperature(function (err, temp) {

        // console.log(typeof temp);
        return bot.sendMessage(message.from.id, 'Current temperature in New York City is '+temp+' ℃');
    })

}

function weatherDesc(message){
    weather.getDescription(function(err, desc){
        // console.log(desc);
        return bot.sendMessage(message.from.id, 'The weather condition is '+desc);
    });
}

function getNews(message){
    fetch(googleNews)
    .then((resp) => resp.json())
    .then(data => {
        var url = data.articles[0].url;
        // console.log(url);
        return bot.sendMessage(message.from.id, url);
    })
}

function getGif(message){
    fetch(giphy)
    .then ((resp)=>resp.json())
    .then (function(data){
        var pic = data.data[Math.floor(Math.random() * 20)].images.original.url
        console.log(pic)
        return bot.sendSticker(message.from.id, pic);
    })
}

// bot.on('/weather',(msg)=>{
//     data = getWeather()
//     return bot.reply.text(data)
// })
// function getWeather(){
//     var url = "https://api.darksky.net/forecast/81a2b6a17f69149707cfaa64d91f9ce1/37.8267,-122.4233"
//     fetch(url)
//     .then((resp) => resp.json())
//     .then(function(data){
//         let weather=  data.currently.icon
//         return weather
//     })
// }



bot.start();