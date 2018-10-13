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
        .then((resp) => resp.json())
        .then(function (data) {
            var pic = data.data[Math.floor(Math.random() * 20)].images.original.url
            console.log(pic)
            return bot.sendSticker(msg.from.id, pic);
        })
});
bot.on(['/start', '/hello'], (msg) => {
    return bot.sendMessage(msg.from.id, `Hi there! I'm your personal assistant. 
/weather to see today's weather
/news to see today's headline in Google News
/twitter to post a status
/gif to get a funny cat sticker
/calender to see next 10 events
Send me a sticker, you'll get a surprise`);
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
    T.post('statuses/update', {
        status: text
    }, function (err, data, response) {
        // console.log(data)
    })
    return bot.sendMessage(msg.from.id, 'Twitter Posted!', {
        replyToMessage: msg.message_id
    });
});

bot.on('/gif', (msg) => {
    getGif(msg);
})

function getQuote(message) {
    randomQuote.getQuote(function (err, quote) {

        console.log(message.from.id);
        return bot.sendMessage(message.from.id, quote.quoteText)
    });

}

function getWeather(message) {
    weather.getTemperature(function (err, temp) {

        // console.log(typeof temp);
        return bot.sendMessage(message.from.id, 'Current temperature in New York City is ' + temp + ' ℃');
    })

}

function weatherDesc(message) {
    weather.getDescription(function (err, desc) {
        // console.log(desc);
        return bot.sendMessage(message.from.id, 'The weather condition is ' + desc);
    });
}

function getNews(message) {
    fetch(googleNews)
        .then((resp) => resp.json())
        .then(data => {
            var url = data.articles[0].url;
            // console.log(url);
            return bot.sendMessage(message.from.id, url);
        })
}

function getGif(message) {
    fetch(giphy)
        .then((resp) => resp.json())
        .then(function (data) {
            var pic = data.data[Math.floor(Math.random() * 20)].images.downsized.url
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

const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
const TOKEN_PATH = 'token.json';

bot.on('/calender', (msg) => {
    // Load client secrets from a local file.
    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Calendar API.
        authorize(JSON.parse(content), listEvents);
        // return bot.sendMessage(msg.from.id, listEvents);
    });
})
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    const calendar = google.calendar({
        version: 'v3',
        auth
    });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`${start} - ${event.summary}`);
                return bot.sendMessage('141449072', `${start} - ${event.summary}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}




bot.start();