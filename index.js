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
      bot.reply(message,'Hello ' + user.name + '!!');
    } else {
      bot.reply(message,'Hello.');
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
      bot.reply(message,'Got it mate. I will call you ' + user.name + ' from now on.');
    });
  });
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot, message) {
  controller.storage.users.get(message.user,function(err, user) {
    if (user && user.name) {
      bot.reply(message,'Your name is ' + user.name);
    } else {
      bot.reply(message,'I don\'t know yet!');
    }
  });
});


controller.hears(['pug me'],'direct_message,direct_mention,mention',function(bot, message) {
  request
    .get('http://pugme.herokuapp.com/random')
    .use(nocache)
    .end(function(err, res) {
      bot.reply(res.body.pug);
    });
});

controller.hears(['identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {
  bot.reply(message,'I am Jemson mate. :jemson:');
});
