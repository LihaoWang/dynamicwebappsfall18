const TeleBot = require('telebot');
const promise = require('make-promises-safe')
var weather = require('openweather-apis');
const bot = new TeleBot('659101762:AAH2EkRouw5QbPOCk8QLaI873B8ddSzqZ0c');
weather.setLang('en')
weather.setCity('London')
weather.setUnits('metric')
weather.setAPPID('fe4868ad1d7a80ef76f097e0561fa4b2')



bot.on('text', (msg) => msg.reply.text(msg.text));
bot.on(['/start', '/hello'], (msg) => {
    return bot.sendMessage(msg.from.id, 'Bam!');
});

bot.on('/weather', (msg) => {
    // return bot.sendMessage(getWeather());
    getWeather(msg);
});

function getWeather(message) {
    weather.getTemperature(function (err, temp) {

        console.log(typeof temp);
        return bot.sendMessage(message.from.id, temp);
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