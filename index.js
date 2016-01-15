if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

var Botkit = require('botkit');
var os = require('os');
var request = require('superagent');

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
      bot.reply(message,'hello' + user.name + '!!');
    } else {
      bot.reply(message,'hey mate');
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

controller.hears(['slackbot'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message, 'ewwww!!');
});

controller.hears(['identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message,'i am Jemson mate. :jemson:');
});
