if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var request = require('superagent');
var _ = require('underscore');
var cleverbot = require('cleverbot.io');
var ai = new cleverbot('pE2lolJyq7JT8YJo', '8ogz07dXwATDK2siONxNywrHK3hoZJfi');
ai.setNick('jemson');
ai.create(function (err, session) {
  console.log(err);
});

var controller = Botkit.slackbot({
  debug: true,
});

var bot = controller.spawn({
  token: process.env.token
}).startRTM();


controller.hears(['hello','hi'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'jemson',
  },function(err, res) {
    if (err) {
      bot.botkit.log('Failed to add emoji reaction :(',err);
    }
  });

  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message, 'hello ' + user.name + '!!');
    } else {
      switch(_.random(1, 4)) {
        case 1:
          bot.reply(message,'hey mate');
          break;
        case 2:
          bot.reply(message,'\'sup mate?');
          break;
        case 3:
          bot.reply(message,'what is going on?');
          break;
        case 4:
          bot.reply(message,'yo');
          break;
      };
    }
  });
});

controller.hears(['call me (.*)'],'direct_message,direct_mention,mention',function(bot, message) {
  var matches = message.text.match(/call me (.*)/i);
  var name = matches[1];
  controller.storage.users.get(message.user,function(err, user) {
    if (!user) {
      user = {
        id: message.user,
      };
    }
    user.name = name;
    controller.storage.users.save(user,function(err, id) {
      bot.reply(message,'got it mate. i\'ll call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['animate me (.*)', 'animate me'],'direct_message,direct_mention,mention',function(bot, message) {
  var matches = message.text.match(/animate me (.*)/i);
  var query;
  if (matches) {
    query = matches[1];
    query = query.split(' ').join('+');
  }
  if (query) {
    switch(_.random(1, 2)) {
      case 1:
        request
          .get('http://api.giphy.com/v1/gifs/search?q=' + query + '&api_key=dc6zaTOxFJmzC&limit=1&offset=0')
          .end(function(err, res) {
            if (res.body.data[0]) {
              bot.reply(message, res.body.data[0].images.original.url);
            } else {
              bot.reply(message, 'what\'s that mate?');
            }
          });
        break;
      case 2:
        .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + query)
          .end(function(err, res) {
            if (res.body.data) {
              bot.reply(message, res.body.data.image_url);
            } else {
              bot.reply(message, 'what\'s that mate?');
            }
          });
        break;
    };
  } else {
    request
      .get('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=crocodile')
      .end(function(err, res) {
        bot.reply(message, res.body.data.image_url);
      });
  }
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {
  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message,'ur name is ' + user.name);
    } else {
      bot.reply(message,'i don\'t know yet!');
    }
  });
});


controller.hears(['pug me'],'direct_message,direct_mention,mention',function(bot, message) {
  request
    .get('http://pugme.herokuapp.com/random')
    .end(function(err, res) {
      bot.reply(message, res.body.pug);
    });
});

controller.hears(['can i ask you a question', 'answer please', 'answer plz', 'can i ask u something', 'can i ask u a question', 'yo'],['direct_message','direct_mention','mention'], function(bot, message) {

  bot.startConversation(message, function(err,convo) {
    convo.ask('shoot',function(response,convo) {
      ai.ask(response.text, function(err, res) {
        convo.say(res.toLowerCase());
        convo.next();
      });
    });
  })

});

controller.hears(['slackbot'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message, 'ewwww!!');
});

controller.hears(['identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message,'i am Jemson mate. :jemson:');
});
