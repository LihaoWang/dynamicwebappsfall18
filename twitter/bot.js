console.log("the bot begins ...")

var Twit = require('twit')

var config = require('./config')

var T = new Twit(config)

// T.get('search/tweets', {
//   q: 'apple since:2011-07-11',
//   count: 100
// }, function (err, data, response) {
//   console.log(data)
// })

setInterval(tweets, 1000 * 20)

function tweets() {

  var costume = ["ghost", "the nun", "witch", "pumpking", "vampire"]
  var quote = costume[Math.floor(Math.random() * costume.length)]
  console.log(quote)
  var tweet = {
    status: quote
  }


  T.post('statuses/update', tweet, didittweet)

  function didittweet(err, data, response) {
    if (err) {
      console.log("it didn't work")
    } else {
      console.log("it worked!")
    }
  }

}

tweets()